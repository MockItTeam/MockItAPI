import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return Ember.RSVP.hash({
      projects: this.store.findAll('project')
    });
  }
});
