import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service('session'),

  redirect() {
    if (window.location.pathname === '/app') {
      this.transitionTo('protected.projects.index');
    }
  },

  actions: {
    signout() {
      // Fix broken layout when clearing the session
      // The application template is based on the session state
      this.disconnectOutlet('main');
      this.get('session').invalidate();
    }
  }
});