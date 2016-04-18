import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.createRecord('project');
  },

  actions: {
    afterSaveProject() {
      this.transitionTo('protected.projects.index');
    }
  }
});
