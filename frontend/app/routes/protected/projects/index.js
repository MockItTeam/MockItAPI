import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Route.extend({
  sessionUser: service('session'),

  model(params, transition) {
    let _self = this;

    return _self.get('sessionUser.currentUser').then((sessionUser) => {
      return Ember.RSVP.hash({
        projects: _self.store.query('project', params),
        invitations: _self.store.query('invitation', {condition: 'recipient'})
      });
    });
  },

  actions: {
    afterAccepted() {
      this.refresh();
    },

    afterRefused() {
      this.refresh();
    },

    applyQueryFilter(filter) {
      let queryParams = {};

      if (filter == 'all') {
        queryParams.condition = null;
      }

      if (filter == 'yours') {
        queryParams.condition = 'owner';
      }

      if (filter == 'shared') {
        queryParams.condition = 'member';
      }

      this.transitionTo(this.routeName, {queryParams: queryParams});
      this.refresh();
    },

    applySearchProject(searchText) {
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
