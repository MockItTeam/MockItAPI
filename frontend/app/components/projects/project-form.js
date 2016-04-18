import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['project-form-container'],

  _checkDirtyAttributes: Ember.on('willRender', function() {
    this.set('canSave', this.get('project').get('hasDirtyAttributes'));
  }),

  actions: {
    save(project) {
      project.save()
        .then(() => {
          this.set('success', `Project ${mockup.get('name')} ${this.get('title')}`);
        }, () => {
          this.set('success', undefined)
        })
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
    }
  }
});
