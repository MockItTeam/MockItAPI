import Ember from 'ember'
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['project-container'],

  actions: {
    searchMockup(data, event) {
      this.sendAction('searchMockup', data);
    }
  }
});