import Ember from 'ember';

export default Ember.Component.extend({
  belongsProjectsCount: Ember.computed('belongsProjects.meta.total_count', function() {
    return this.get('belongsProjects.meta.total_count');
  }),

  belongsProjectsPages: Ember.computed('belongsProjects.meta.pagination.last.number'
    , 'belongsProjects.meta.pagination.self.number'
    , function() {

      const total = this.get('belongsProjects.meta.pagination.last.number') || this.get('belongsProjects.meta.pagination.self.number');
      if (!total) return [];
      return new Array(total + 1).join('x').split('').map((e, i) => i + 1);
    }),

  sharedProjectsCount: Ember.computed('sharedProjects.meta.total_count', function() {
    if(Ember.isEmpty(this.get('sharedProjects')) ) return 0;
    return this.get('sharedProjects.meta.total_count');
  }),

  sharedProjectsPages: Ember.computed('sharedProjects.meta.pagination.last.number'
    , 'sharedProjects.meta.pagination.self.number'
    , function() {

      const total = this.get('sharedProjects.meta.pagination.last.number') || this.get('sharedProjects.meta.pagination.self.number');
      if (!total) return [];
      return new Array(total + 1).join('x').split('').map((e, i) => i + 1);
    }),

  actions: {
    applyPagination(page, type) {
      this.sendAction('applyPagination', page, type);
    }
  }
});
