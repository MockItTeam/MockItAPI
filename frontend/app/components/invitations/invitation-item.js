import Ember from 'ember'

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['incoming-invitation-item'],
  fadeFact: false,

  actions: {
    fade() {
      let fadeFact = this.get('fadeFact');
      let $item = this.$();

      if (fadeFact) {
        $item.animate({'right': `-=${$item.width()}px`}, 'slow');
        this.set('fadeFact', false);
      } else {
        $item.animate({'right': `+=${$item.width()}px`}, 'slow');
        this.set('fadeFact', true);
      }
    },

    acceptInvite(invitation) {
      invitation.set('status', 'accepted');
      invitation.save()
        .then(() => {
          this.sendAction('afterAccepted');
        }, () => {
          this.set('success', undefined);
        });
    },

    refuseInvite(invitation) {
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