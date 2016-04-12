import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate() {
    this.render({into: 'protected/projects'});
  },

  model(params, transition) {
    let _self = this;

    let projectId = transition.params['protected.projects.detail'].project_id;
    return _self.store.findRecord('project', projectId, {reload: true});
  },

  afterModel(model) {
    let project = model;

    project.get('members')
      .then((members) => {
        project.set('members', members.sortBy('username'));
      });
  },

  actions: {
    afterCreateInvitation() {
      this.refresh();
    }
  }
});
