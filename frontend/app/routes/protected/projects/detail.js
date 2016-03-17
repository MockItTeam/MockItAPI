import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return Ember.RSVP.hash({
      project: this.store.findRecord('project', params.project_id, { reload: true }).then((project) => {
        project.get('invitations').then((invitations) => {
          project.set('invitations', invitations.filterBy('status', 'pending'));
        });
        return project;
      })
    });
  },

  actions: {
    afterDeleted() {
      this.transitionTo('projects.index');
    }
  }
});
