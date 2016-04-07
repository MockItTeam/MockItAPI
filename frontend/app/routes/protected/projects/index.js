import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Route.extend({
  sessionUser: service('session'),

  model(params, transition) {
    let _self = this;

    return this.get('sessionUser.currentUser').then((sessionUser) => {
      return Ember.RSVP.hash({
        belongsProjects: _self.store.query('project', {
          page: params.belongsProjectsPage,
          per_page: params.perPage,
          owner: sessionUser.get('id')
        }, {reload: true}),
        sharedProjects: _self.store.query('project', {
          page: params.sharedProjectsPage,
          per_page: params.perPage,
          member: sessionUser.get('id')
        }, {reload: true})
        //, invitations: _self.store.query('invitation', {user_id: sessionUser.get('id')}, {reload: true})
      });
    });
  },

  actions: {
    afterAccepted() {
      this.refresh();
    },

    afterRefused() {
      this.refresh();
    }
  }
});
