import Ember from 'ember';
import Pollster from '../../utils/pollster';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['app-card'],
  store: service('store'),

  _setupPollster: Ember.on('didInsertElement', function() {
    let _self = this;

    if (Ember.isNone(this.get('pollster'))) {
      _self.set('pollster', Pollster.create({
        onPoll() {
          _self.get('mockup').reload();
        }
      }));
    }

    this.get('pollster').start();
  }),

  _statusObserver: Ember.observer(
    'mockup.status',
    function() {
      let mockupStatus = this.get('mockup.status');
      if (mockupStatus == 'created') {
        this.$('.in-progress-tab').attr('hidden', 'hidden');
        this.$().removeAttr('disabled');
        this.get('pollster').stop();
      } else {
        this.$('.in-progress-tab').removeAttr('hidden');
        this.$().attr('disabled', 'disabled');
      }
    }
  )
});