import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['app-card'],
  sessionUser: service('session'),

  _checkMemberIsYou: Ember.on(
    'didReceiveAttrs',
    'willRender',
    function() {
      let member = this.get('member');
      this.set('canManage', this.get('owner.username') != member.get('username'));
    }
  ),

  _checkIsProjectOwner: Ember.on(
    'didReceiveAttrs',
    'willRender',
    function() {
      this.get('sessionUser.currentUser').then((currentUser) => {
        if (this.get('owner.username') == currentUser.get('username')) {
          this.set('isOwner', true);
        } else {
          this.set('isOwner', false);
        }
      });
    }),

  actions: {
    kickMember(member) {
      this.sendAction('kickMember', member);
    },

    transferOwner(member) {
      this.sendAction('transferOwner', member);
    }
  }
});