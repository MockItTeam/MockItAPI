import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  sessionUser: service('session'),

  actions: {
    applyTransferOwner(member) {
      let project = this.get('project');

      project.set('owner', member);

      project.save()
        .then(() => {
          this.set('success', `Now ${member.get('username')} is project owner.`);
        }, () => {
          this.set('success', undefined);
        });
    },

    applyKickMember(member) {
      let project = this.get('project');

      project.get('members').then((members) => {
        members.removeObject(member);
      });

      project.save()
        .then(() => {
          this.set('success', `You kick ${member.get('username')} out of project members.`);
        }, () => {
          this.set('success', undefined);
        });
    }
  }
});