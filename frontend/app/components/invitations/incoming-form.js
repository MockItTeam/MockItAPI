import Ember from 'ember'

export default Ember.Component.extend({

  actions: {

    accept(invitation) {
      invitation.set('status', 'accepted');
      invitation.save()
        .then(() => {
          this.sendAction('afterAccepted');
        }, () => {
          this.set('success', undefined);
        });
    },

    refuse(invitation) {
      invitation.set('status', 'refused');
      invitation.save()
        .then(() => {
          this.sendAction('afterRefused');
        }, () => {
          this.set('success', undefined);
        });
    }
  }
});
