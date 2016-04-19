import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: service('session'),

  activate() {
    if (this.get('session.isAuthenticated')) {
      let path = window.location.pathName;
      if (path == undefined || path == '/') {
        console.log(window.location);
        this.transitionTo('protected.projects.index');
      }
    } else {
      this.transitionTo('sessions.new');
    }
  }
});