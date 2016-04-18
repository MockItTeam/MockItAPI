import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    let _self = this;
    return _self.store.findRecord('project', params.project_id, {reload: true})
      .then((project) => {
        project.get('mockups').then((mockups) => {
          if (params.name)
            project.set('mockups', mockups.filter(function(mockup) {
              if (mockup.get('name').toLowerCase().indexOf(params.name) > -1)
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
        queryParams.name = searchText.toLowerCase();
      } else {
        queryParams.name = null;
      }

      this.transitionTo(this.routeName, {queryParams: queryParams});
      this.refresh();
    },

    applyCreateMockup(mockup) {
      this.transitionTo('protected.projects.detail.mockups.detail', mockup.get('id'));
    }
  }
});
