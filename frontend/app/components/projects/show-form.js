import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['project-container'],
  store: service('store'),

  isShowingProjectName: false,

  _autoFocusToggleInput: Ember.on('didRender',
    Ember.observer(
      'isShowingProjectName',
      function() {
        this.$('.toggle-input').focus();
      })
  ),

  _resetAlert() {
    this.set('success', undefined);
    this.set('errorMessage', undefined);
  },

  _saveProjectName() {
    let project = this.get('project');

    if (project.get('hasDirtyAttributes')) {

      project.save()
        .then(() => {
          this.set('success', 'Change project name success.');
        }, (error) => {
          project.rollbackAttributes();
          this.set('errorMessage', error.errors[0].detail);
        });
    }
  },

  actions: {
    searchMockup(data, event) {
      this.sendAction('searchMockup', data);
    },

    createMockup() {
      let mockup = this.get('store')
        .createRecord('mockup', {
          project: this.get('project')
        });

      mockup.save()
        .then(() => {
          this.sendAction('createMockup', mockup);
        });
    },

    createMockupWithPhoto(files) {
      let mockup = this.get('store')
        .createRecord('mockup', {
          project: this.get('project')
        });

      if (files[0]) {
        mockup.set('image', files[0]);
      }

      mockup.save()
        .then(() => {
          this.set('success', 'Your mockup is created, and now it is in progress');
        });
    },

    afterDeleteMockup(message) {
      this._resetAlert();
      this.set('success', message);
    },

    applyErrorImageProcess(errorMessage) {
      this._resetAlert();
      this.set('errorMessage', errorMessage);
    },

    toggleEdit(){
      this._resetAlert();
      this.toggleProperty('isShowingProjectName');

      if(!this.get('isShowingProjectName')) {
        this._saveProjectName();
      }
    },

    typeProjectName(data, event) {
      this._resetAlert();

      if(event.keyCode == 13) {
        this.toggleProperty('isShowingProjectName');
        this._saveProjectName();
      }
    }
  }
});
