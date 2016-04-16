import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['app-card'],
  sessionUser: service('session'),

  _checkIsProjectOwner: Ember.on(
    'didReceiveAttrs',
    'willRender',
    function() {
      this.get('sessionUser.currentUser').then((currentUser) => {
        this.set('canDelete', currentUser.get('username') == this.get('owner.username'));
      });
    }),

  actions: {

    deleteProject(project) {
      let c = confirm(`Are you sure to delete project '${project.get('name')}'?`)

      if (c) {
        project.deleteRecord();
        project.save()
          .then(() => {
            this.sendAction('deleteProject', `Delete project '${project.get('name')}' success.`);
          });
      }
    }
  }
});