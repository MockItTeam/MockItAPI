import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Route.extend({
  sessionUser: service('session'),

  queryParams: {
    sharedProjectsPage: {
      refreshModel: true,
      replace: true
    },
    belongsProjectsPage: {
      refreshModel: true,
      replace: true
    }
  },

  model(params, transition) {
    let _self = this;

    return this.get('sessionUser.currentUser').then((sessionUser) => {
      return Ember.RSVP.hash({
        belongsProjects: _self.store.query('project', {
          page: params.belongsProjectsPage,
          per_page: params.perPage,
          owner: sessionUser.get('id')
        }),
        sharedProjects: _self.store.query('project', {
          page: params.sharedProjectsPage,
          per_page: params.perPage
        })
        //, invitations: _self.store.query('invitation', {user_id: sessionUser.get('id')}, {reload: true})
      });
    });
  },

  afterModel(model) {
    this.get('sessionUser.currentUser').then((sessionUser) => {
      //keep original meta
      let oCurrentPage = model.sharedProjects.meta.current_page;
      let oNextPage = model.sharedProjects.meta.next_page;
      let oPrevPage = model.sharedProjects.meta.prev_page;
      let oTotalCount = model.sharedProjects.meta.total_count;
      let oTotalPages = model.sharedProjects.meta.total_pages;

      model.sharedProjects = model.sharedProjects.rejectBy('owner.username', sessionUser.get('username'));
      model.sharedProjects.meta = {
        current_page: oCurrentPage,
        next_page: oNextPage,
        prev_page: oPrevPage,
        total_pages: oTotalPages,
        total_count: oTotalCount
      }
    });
  },

  queryParamsObserver: Ember.observer(
    'queryParams.belongsProjectsPage',
    'queryParams.sharedProjectsPage',
    function() {
      Ember.run.scheduleOnce('afterRender', this, this.queryModel);
    }
  ),

  queryModel() {
    if(this.modelFor('protected.projects.index')) {
      this.transitionTo(this.routeName, {queryParams: this.get('queryParams')});
      this.refresh();
    }
  },

  actions: {
    afterAccepted() {
      this.refresh();
    },

    afterRefused() {
      this.refresh();
    },

    applyPagination(page, type) {
      if(page) {
        if(type === 'belongs') {
          this.set('queryParams.belongsProjectsPage', page);
        } else if (type === 'shared') {
          this.set('queryParams.sharedProjectsPage', page);
        }
      }
    }
  }
});
