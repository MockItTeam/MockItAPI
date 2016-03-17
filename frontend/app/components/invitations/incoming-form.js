import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service('store'),
  sessionUser: service('session'),

  actions: {

    accept(invitation) {
      invitation.set('status', 'accepted');
      invitation.save().then(() => {
        this.sendAction('afterAccept');
      }, () => {
        this.set('success', undefined);
      });
    },

    refuse(invitation) {
      invitation.set('status', 'refused');
      invitation.save().then(() => {
        this.set('success', 'success');
      }, () => {
        this.set('success', undefined);
      });
    }
  }
});
