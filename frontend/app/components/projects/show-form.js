import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  sessionUser: service('session'),
  
  _checkDirtyAttributes: Ember.on('willRender', function() {
    this.set('canSave', this.get('project').get('hasDirtyAttributes'));
  }),

  _checkIsOwnerProject: Ember.on('willRender', function() {
    let currentUser = this.get('sessionUser.currentUser');
    this.set('canKick', currentUser.get('id') == this.get('project.owner.id'));
    this.set('canAssign', currentUser.get('id') == this.get('project.owner.id'));
  }),

  actions: {
    save(project) {
      if (project.get('hasDirtyAttributes')) {
        project.save().then(() => {
          this.set('success', 'Project updated');
        }, () => {
          this.set('success', undefined);
        })
      }
    },

    destroy(project) {
      project.deleteRecord();
      project.get('isDeleted');
      project.save().then(() => {
        this.sendAction('afterDeleted');
      }, () => {
        this.set('success', undefined);
      })
    },

    kickMember(member) {
      this.get('project.members').removeObject(member);
      this.get('project').save().then(() => {
        this.set('success', 'Kick member success');
      }, () => {
        this.set('success', undefined);
      })
    },

    assignOwner(member) {
      let project = this.get('project');

      project.get('members').removeObject(member);
      project.get('owner').then((owner) => {
        project.get('members').pushObject(owner);
        project.set('owner', member);
      });
      
      project.save().then(() => {
        this.set('success', 'success');
      }, () => {
        this.set('success', undefined);
      })
    }
  }
});