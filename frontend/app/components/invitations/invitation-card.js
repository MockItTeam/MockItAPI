import Ember from 'ember'

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['app-card'],
  sessionUser: service('session'),

  _checkIsOwnerInvitation: Ember.on(
    'didReceiveAttrs',
    'willRender',
    function() {
      this.get('sessionUser.currentUser').then((currentUser) => {
        this.set('canCancel', currentUser.get('username') == this.get('invitation.sender_name') || currentUser.get('username') == this.get('owner.username'));
      });
    }),

  actions: {
    cancelInvitation(invitation) {

      let c = confirm(`Are you sure to delete invite user '${invitation.get('recipient.username')}'?`);

      if (c) {
        this.sendAction('cancelInvitation', invitation);
      }
    }
  }
});