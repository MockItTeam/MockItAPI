import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from "../config/environment";
import FormDataAdapterMixin from "../mixins/form-data-adapter-mixin"

const {
  InvalidError,
  errorsHashToArray
  } = DS;

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, FormDataAdapterMixin, {
  namespace: 'api/v1',
  authorizer: 'authorizer:application',

  // allows the multiword paths in urls to be underscored
  pathForType: function (type) {
    let underscored = Ember.String.underscore(type);
    return Ember.String.pluralize(underscored);
  },

  /**
   Overrides the `handleResponse` method to format errors passed to a DS.InvalidError
   for all 422 Unprocessable Entity responses
   Reused from Active Model Adapter: https://github.com/ember-data/active-model-adapter/blob/master/addon/active-model-adapter.js
   @method ajaxError
   @param {Object} jqXHR
   @return error
   */
  handleResponse: function(status, headers, payload) {
    if (this.isInvalid(status, headers, payload)) {
      let errors = errorsHashToArray(payload.errors);

      return new InvalidError(errors);
    } else {
      return this._super(...arguments);
    }
  },
  // allows queries to be sent along with a findRecord
  // hopefully Ember / EmberData will soon have this built in
  // ember-data issue tracked here:
  // https://github.com/emberjs/data/issues/3596
  urlForFindRecord(id, modelName, snapshot) {
    let url = this._super(...arguments);
    let query = Ember.get(snapshot, 'adapterOptions.query');
    if (query) {
      url += '?' + Ember.$.param(query);
    }
    return url;
  }
});