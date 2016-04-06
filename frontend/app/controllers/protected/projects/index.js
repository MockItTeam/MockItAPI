import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['sharedProjectsPage', 'belongsProjectsPage', 'perPage'],
  sharedProjectsPage: 1,
  belongsProjectsPage: 1,
  perPage: 3
});