import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Route.extend({
  sessionUser: service('session'),

  model() {
    return this.get('sessionUser.currentUser').then((sessionUser) => {
      return Ember.RSVP.hash({
        projects: this.store.findAll('project', {reload: true}),
        invitations: this.store.query('invitation', {user_id: sessionUser.get('id')}, {reload: true})
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
