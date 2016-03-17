import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service('store'),
  sessionUser: service('session'),

  _checkIsOwnerInvitation: Ember.on('didReceiveAttrs', 'willRender', function() {
    this.get('sessionUser.currentUser').then((currentUser) => {
      this.set('canCancel', currentUser.get('id') == this.get('project.owner.id'));
    });
  }),

  actions: {
    inviteUser() {
      let username = this.get('member_name');
      let currentUser = this.get('sessionUser.currentUser');
      let invitation = this.get('store').createRecord('invitation',
        {
          project: this.get('project'),
          sender: currentUser
        });

      this.get('store').queryRecord('user', {username: username})
        .then((recipient) => {
          invitation.set('recipient', recipient[0]);

          invitation.save()
            .then(() => {
              this.set('success', username + ' is invited.');
            }, () => {
              this.set('success', undefined);
              this.get('store').unloadRecord(invitation);
              this.get('invitations').removeObject(invitation);
            });
        });

      this.set('invitation', invitation);
    },

    cancelInvite(invitation) {
      invitation.deleteRecord();
      invitation.save()
        .then(() => {
          this.get('invitations').removeObject(invitation);
          this.set('invitation', undefined);
          this.set('success', 'Cancel invite success');
        }, () => {
          this.set('success', undefined);
        })
    }
  }
});
