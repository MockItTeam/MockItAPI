import Ember from 'ember';
import DS from 'ember-data';

var underscore = Ember.String.underscore;

export default DS.JSONAPISerializer.extend({
  keyForAttribute(key) {
    return underscore(key);
  },

  keyForRelationship(rawKey) {
    return underscore(rawKey);
  },

  payloadKeyFromModelName(modelName) {
    return underscore(modelName);
  }
});