import Ember from 'ember';
import DS from 'ember-data';
import ESASession from 'ember-simple-auth/services/session';

const { service } = Ember.inject;

export default ESASession.extend({
  store: service('store'),

  currentUser: Ember.computed('session.data.authenticated.currentUser', function() {
    return DS.PromiseObject.create({
      promise: this.get('store').findRecord('user', 'me')
    });
  })
});