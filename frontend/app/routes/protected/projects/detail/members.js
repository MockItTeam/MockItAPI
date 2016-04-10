import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate() {
    this.render({into: 'protected/projects'});
  },

  model(params, transition) {
    let projectId = transition.params['protected.projects.detail'].project_id;
    return this.store.findRecord('project', projectId, {reload: true});
  },

  afterModel(model) {
    model.get('members')
      .then((members) => {
        model.set('members', members.sortBy('username'));
      });
  },

  actions: {
    applyTransferOwner(member) {
      let project = this.modelFor(this.routeName);

      project.set('owner', member);

      project.save()
        .then(() => {
          project.set('success', `Now ${member.get('username')} is project owner.`);
        }, () => {
          project.set('success', undefined);
        });
    },

    applyKickMember(member) {
      let project = this.modelFor(this.routeName);

      //project.set('members', project.get('members').removeObject(member));

      project.get('members').then((members) => {
        members.removeObject(member);
      });

      project.save()
        .then(() => {
          project.set('success', `You kick ${member.get('username')} out of project members.`);
        }, () => {
          project.set('success', undefined);
        });
    }
  }
});
