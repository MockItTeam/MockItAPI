import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  sessionUser: service('session'),
  
  _checkDirtyAttributes: Ember.on('willRender', function() {
    this.set('canSave', this.get('project').get('hasDirtyAttributes'));
  }),

  _checkIsOwnerProject: Ember.on('didReceiveAttrs', 'willRender', function() {
    this.get('sessionUser.currentUser').then((currentUser) => {
      this.set('canKick', currentUser.get('id') == this.get('project.owner.id'));
      this.set('canAssign', currentUser.get('id') == this.get('project.owner.id'));
    });
  }),

  _cannotKickOrAssignOwner: Ember.on('init', 'didReceiveAttrs', 'willRender', function() {
    this.get('project.members').then((members) => {
      members.forEach((member) => {
        if (member.get('username') == this.get('project.owner.username')) {
          member.set('isOwner', true);
        } else {
          member.set('isOwner', false);
        }
      });
    })
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
          this.set('success', 'Kick member success');
        }, () => {
          this.set('success', undefined);
        })
    },

    assignOwner(member) {
      let project = this.get('project');

      project.get('members').removeObject(member);

      project.get('owner')
        .then((owner) => {
          project.get('members').pushObject(owner);
          project.set('owner', member);
        });
      
      project.save()
        .then(() => {
          this.set('success', 'success');
        }, () => {
          this.set('success', undefined);
        })
    }
  }
});