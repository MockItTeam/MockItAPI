import Ember from 'ember';
import Pollster from '../../utils/pollster';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['app-card'],
  store: service('store'),

  _setupPollster: Ember.on(
    'didInsertElement',
    function() {
      let _self = this;

      if (Ember.isNone(this.get('pollster'))) {
        _self.set('pollster', Pollster.create({
          onPoll() {
            _self.get('mockup')
              .reload()
              .then(() => {

              }, () => {
                _self.get('pollster').stop();
                _self.get('pollster').destroy();
              });
          }
        }));
      }
      this.get('pollster').start();
    }),

  _checkMockupFound: Ember.on('didRender',
    Ember.observer('mockup',
      function() {
        if (!this.get('mockup') && this.get('pollster')) {
          this.get('pollster').stop();
          this.get('pollster').destroy();
        }
      })),

  _statusObserver: Ember.on(
    'didInsertElement',
    'didRender',
    Ember.observer('mockup.status',
      function() {
        let mockupStatus = this.get('mockup.status');
        let spanText = '';

        this._resetTab();

        if (mockupStatus == 'created') {
          if (this.get('pollster'))
            this.get('pollster').stop();
        }

        if (mockupStatus == 'in_progress') {
          this.$('.tab').removeAttr('hidden');
          console.log('in progress');
          spanText = 'In Progress...';
        }

        if (mockupStatus == 'error') {
          this.$('.tab').removeAttr('hidden');
          this.$('.btn-tab').addClass('retry');
          this.$('.tab-menu').addClass('dropdown');
          spanText = 'Retry...';
        }

        this.$('.btn-tab').html(spanText);
      }
    )),

  willDestroyElement() {
    if (!Ember.isNone(this.get('pollster'))) {
      this.get('pollster').stop();
    }
    this.get('pollster').destroy();
  },

  _resetTab() {
    this.$('.tab').attr('hidden', 'hidden');
    this.$('.btn-tab').removeClass('retry');
    this.$('.tab-menu').removeClass('dropdown');
  },

  actions: {

    retryProcessMockup(mockup) {
      let _self = this;

      _self.get('pollster').stop();
      mockup.save()
        .then(() => {
          _self._resetTab();
          _self.get('pollster').start();
        });
    },

    deleteMockup(mockup) {
      let _self = this;

      _self.get('pollster').stop();
      mockup.deleteRecord();
      mockup.save()
        .then(() => {
          this.sendAction('deleteMockup', `Delete mockup '${mockup.get('name')}' successfully.`)
        });
    }
  }
});