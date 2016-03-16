import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service('store'),
  sessionUser: service('session'),

  _checkIsOwnerInvitation: Ember.on('willRender', function() {
    let currentUser = this.get('sessionUser.currentUser');
    this.set('canCancel', currentUser.get('id') == this.get('project.owner.id'));
  }),

  actions: {
    inviteUser() {
      let username = this.get('member_name');
      let invitation = this.get('store').createRecord('invitation');
      let currentUser = this.get('sessionUser.currentUser');

      this.set('invitation', invitation);

      invitation.set('sender_id', currentUser.get('id'));
      invitation.set('project_id', this.get('project.id'));

      this.get('store').queryRecord('user', { username: username }).then((recipient) => {
        invitation.set('recipient_id', recipient[0].get('id'));
        invitation.set('recipient', recipient[0]);

        invitation.save().then(() => {
          this.get('invitations').pushObject(invitation);
        }, () => {
          this.set('success', undefined);
        });
      });
    },

    cancelInvite(invitation) {
      this.get('invitations').removeObject(invitation);

      invitation.deleteRecord();

      invitation.save().then(() => {
        this.set('success', 'Cancel invite success');
      }, () => {
        this.set('success', undefined);
      })
    }
  }
});
