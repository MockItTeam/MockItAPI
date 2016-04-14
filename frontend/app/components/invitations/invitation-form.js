import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service('store'),
  sessionUser: service('session'),

  actions: {
    createInvitation() {
      this._resetForm();

      let memberUsername = this.get('memberUsername');
      let currentUser = this.get('sessionUser.currentUser');
      let _store = this.get('store');

      _store.queryRecord('user', {username: memberUsername})
        .then((user) => {

          //Create Invitation
          let invitation = _store.createRecord('invitation',
            {
              project: this.get('project'),
              sender: currentUser,
              recipient: user
            });

          invitation.save()
            .then(() => {
              this.set('success', `Invitation of user ${memberUsername} is created.`);
              this.sendAction('afterCreateInvitation');
            }, (xhr) => {
              this.set('success', undefined);
              this.set('errorMessage', xhr.errors[0].detail);

              //unload empty invitation
              invitation.unloadRecord();
            });
        }, () => {
          this.set('errorMessage', `User ${memberUsername} is not found.`);
        });
    },

    applyCancelInvitation(invitation) {
      invitation.deleteRecord();

      invitation.save()
        .then(() => {
          this.get('invitations').removeObject(invitation);
          this.set('success', `Invitation of user ${invitation.get('recipient_name')} is cancelled.`);
        }, () => {
          this.set('success', undefined);
        });
    }
  },

  _resetForm() {
    this.set('errorMessage', undefined);
    this.set('success', undefined);
  }
});
