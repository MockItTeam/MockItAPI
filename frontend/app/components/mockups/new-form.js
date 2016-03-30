import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  sessionUser: service('session'),
  store: service('store'),

  actions: {

    upload_mockup(){
      let file = this.get('mockupImage');
      let description = this.get('image_description');
      let mockup = this.get('store').createRecord('mockup',
        {
          project: this.get('project'),
          image: file,
          description: description
        });
      mockup.save()
        .then((mockup) => {
          this.transitionTo('protected.projects.detail.mockups.detail', mockup.id);
        }, () => {
          this.set('success', undefined);
        });
    },

    preview(files) {

      if (files[0]) {
        this.set('mockupImage', files[0]);
        var reader = new FileReader();
        reader.onload = (e) => {
          $('.image-upload-container .image-preview img').attr('src', e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    },
  }
});
