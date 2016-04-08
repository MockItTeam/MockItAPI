import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['condition','name'],
  condition: null,
  name: null
});