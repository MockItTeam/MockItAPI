import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    save(project) {
      project.save()
        .then(() => {
          this.set('success', 'Project created');
        }, () => {
          this.set('success', undefined)
        })
    }
  }
});
