import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: service('session'),

  activate() {
    if (this.get('session.isAuthenticated')) {
      let path = window.location.pathname;
      if (path == undefined || path == '/') {
        this.transitionTo('protected.projects.index');
      }
    } else {
      this.transitionTo('sessions.new');
    }
  }
});