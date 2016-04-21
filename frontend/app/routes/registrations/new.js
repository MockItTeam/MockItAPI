import Ember from 'ember';
import $ from 'jquery';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  session: service('session'),

  activate() {
    $('html').attr('class', 'layout-form is-auth is-sign-up');
  },

  actions: {
    afterSignup(identification, password) {
      this
        .get('session')
        .authenticate('authenticator:oauth2', identification, password);
    }
  }
});