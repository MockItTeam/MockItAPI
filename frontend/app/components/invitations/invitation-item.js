import Ember from 'ember'

export default Ember.Component.extend({
  fade: 'in',
  
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
    },
    
    fadeNotification(invitationId) {
      let $invitationContainer = $(`#invitation-${invitationId}`);
      let fadeCondition = this.get('fade');
      
      if (fadeCondition == 'in') {
        $invitationContainer.animate({'right': `+=${$invitationContainer.width() + 60}px`}, 'slow');
        this.set('fade', 'out');
      }
      
      if (fadeCondition == 'out') {
        $invitationContainer.animate({'right': `-=${$invitationContainer.width() + 60}px`}, 'slow');
        this.set('fade', 'in');
      }
    }
  }
  
});
