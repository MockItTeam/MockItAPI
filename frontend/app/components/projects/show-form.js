import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['project-container'],
  store: service('store'),

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
      this.set('success', message);
    }
  }
});