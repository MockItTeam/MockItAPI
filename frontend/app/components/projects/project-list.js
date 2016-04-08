import Ember from 'ember';

export default Ember.Component.extend({

  filterSelectionObserver: Ember.observer(
    'filterSelection',
    function() {
      this.sendAction('queryFilter', this.get('filterSelection'));
    }
  ),

  actions: {
    filterProjects(selection, component) {
      if (selection) {
        this.set('filterSelection', selection);
      } else {
        this.set('filterSelection', component.get('default'));
      }
    },

    searchProject(data, event) {
      this.sendAction('searchProject', data);
    },
  }
});
