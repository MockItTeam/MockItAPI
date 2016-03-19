import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  sessionUser: service('session'),

  _checkIsOwnerProject: Ember.on('didReceiveAttrs', 'willRender', function() {
    this.get('sessionUser.currentUser').then((currentUser) => {
      this.get('project.owner').then((owner) => {
        this.set('canKick', currentUser.get('id') == owner.get('id'));
        this.set('canAssign', currentUser.get('id') == owner.get('id'));
      });
    });
  }),

  _cannotKickOrAssignOwner: Ember.on('didReceiveAttrs', 'willRender', function() {
    this.get('project.members').then((members) => {
      members.forEach((member) => {
        this.get('project.owner').then((owner) => {
          if (member.get('username') == owner.get('username')) {
            member.set('isOwner', true);
          } else {
            member.set('isOwner', false);
          }
        });
      });
    });
  }),

  actions: {
    save(project) {
      if (project.get('hasDirtyAttributes')) {
        project.save()
          .then(() => {
            this.set('success', 'Project updated');
          }, () => {
            this.set('success', undefined);
          })
      }
    },

    destroy(project) {
      project.deleteRecord();

      project.save()
        .then(() => {
          this.sendAction('afterDeleted');
        }, () => {
          this.set('success', undefined);
        })
    },

    kickMember(member) {
      let project = this.get('project');

      project.get('members').removeObject(member);

      project.save()
        .then(() => {
          this.set('success', 'You kick ' + member + ' out of project members.');
        }, () => {
          this.set('success', undefined);
        })
    },

    assignOwner(member) {
      let project = this.get('project');

      project.get('owner')
        .then((owner) => {
          project.get('members').removeObject(member);
          project.get('members').pushObject(owner);
          project.set('owner', member);
        });
      
      project.save()
        .then(() => {
          this.set('success', 'Now ' + member + 'is project owner.');
        }, () => {
          this.set('success', undefined);
        })
    }
  }
});