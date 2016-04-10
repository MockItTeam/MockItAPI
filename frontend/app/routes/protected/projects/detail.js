import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    let _self = this;
    return _self.store.findRecord('project', params.project_id, {reload: true})
      .then((project) => {
        project.get('mockups').then((mockups) => {
          if (params.name)
            project.set('mockups', mockups.filter(function(mockup) {
              if (mockup.get('name').indexOf(params.name) > -1)
                return mockup;
            }));
        });

        return project;
      });
  },

  actions: {
    afterDeleted() {
      this.transitionTo('projects.index');
    },

    applySearchMockup(searchText) {
      let queryParams = {};

      if (!Ember.isEmpty(searchText)) {
        queryParams.name = searchText;
      } else {
        queryParams.name = null;
      }

      this.transitionTo(this.routeName, {queryParams: queryParams});
      this.refresh();
    }
  }
});
