import Ember from 'ember';

// only process the following request method
const applyForMethod = ['POST', 'PUT', 'PATCH'];

export default Ember.Mixin.create({
  ajaxOptions: function(url, requestMethod, options) {
    let originalData = options && options.data;
    let currentOptions = this._super.apply(this, arguments);

    // check basic requirements for form data serialization
    if ((applyForMethod.indexOf(requestMethod) >= 0) && // request method
      (typeof FormData !== 'undefined') && // FormData API availability
      (originalData instanceof Object) &&  // data availability
      (!(originalData instanceof FormData))) { // and iterability

      let aFormData = new FormData();
      let formDataRequired = false;

      console.log(originalData);

      // recursive object walker
      var objectWalker = function(object, key) { // deliberately choose var for inner scope accessibility
        if ((object instanceof Object) && !(object instanceof File)) { // if object walkable
          for (var propertyName in object) { // walk each property
            if (object.hasOwnProperty(propertyName)) {
              objectWalker(
                object[propertyName], // peel out object encapsulation
                (key) ? (key + '[' + propertyName + ']') : propertyName // exclude brackets for root key
              );
            }
          }
        } else { // not walkable object
          aFormData.append(key, object? object: '');
          if (object instanceof File) { // check if it contains any file
            formDataRequired = true;
          }
        }
      };
      objectWalker(originalData); // start the iteration

      // apply change only if required
      if (formDataRequired) {
        currentOptions.processData = false;
        currentOptions.contentType = false;
        currentOptions.data = aFormData;
      }
    }

    return currentOptions;
  }
});