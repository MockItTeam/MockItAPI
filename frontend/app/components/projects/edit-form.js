import Ember from 'ember'
import $ from 'jquery';
const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service('store'),
  sessionUser: service('session'),

  _checkDirtyAttributes: Ember.on('willRender', function() {
    this.set('canSave', this.get('project').get('hasDirtyAttributes'));
  }),

  actions: {
    toggleEdit(){
      this.toggleProperty('isShowingProjectName');
    },

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

    preview(files) {
      let project = this.get('project');

      if (files[0]) {
        project.set('image', files[0]);

        var reader = new FileReader();
        reader.onload = (e) => {
          $('.image-upload-container .image-preview img').attr('src', e.target.result);
        }

        reader.readAsDataURL(files[0]);
      }
    },

    uploadImage(project) {
      project.save()
        .then(() => {
          this.set('success', 'Upload succesful');
        }, () => {
          this.set('success', undefined);
        })
    },

    destroy(project) {
      project.deleteRecord();

      project.save()
        .then(() => {
          this.sendAction('afterDeleted');
        }, () => {
          this.set('success', undefined);
        })
    }

  }
});
