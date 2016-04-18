import Ember from 'ember';
import Pollster from '../../utils/pollster';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['app-card'],
  store: service('store'),
  sessionUser: service('session'),

  _checkIsProjectOwner: Ember.on(
    'didReceiveAttrs',
    'willRender',
    function() {
      this.get('sessionUser.currentUser').then((currentUser) => {
        this.set('canDelete', currentUser.get('username') == this.get('projectOwner.username') || currentUser.get('username') == this.get('mockupOwner.username'));
      });
    }),

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
                _self._stopPollster();
              });
          }
        }));
      }
      this.get('pollster').start();
    }),

  _checkMockupFound: Ember.on('didRender',
    Ember.observer('mockup',
      function() {
        if (!this.get('mockup')) {
          this._removePollster();
        }
      })),

  _statusObserver: Ember.on(
    'didRender',
    Ember.observer('mockup.status',
      function() {
        let mockupStatus = this.get('mockup.status');
        let spanText = '';

        this._resetTab();

        if (mockupStatus == 'created' && this.get('pollster')) {
          this._stopPollster();
        }

        if (mockupStatus == 'in_progress') {
          this.$('.tab').removeAttr('hidden');
          console.log('in progress');
          spanText = 'In Progress...';
        }

        if (mockupStatus == 'error') {
          this._stopPollster();
          this.$('.tab').removeAttr('hidden');
          this.$('.btn-tab').addClass('retry');
          this.$('.tab-menu').addClass('dropdown');
          this._filterErrorMessage(this.get('mockup'));
          spanText = 'Retry...';
        }

        this.$('.btn-tab').html(spanText);
      }
    )),

  willDestroyElement() {
    this._stopPollster();
  },

  _resetTab() {
    this.$('.tab').attr('hidden', 'hidden');
    this.$('.btn-tab').removeClass('retry');
    this.$('.tab-menu').removeClass('dropdown');
  },

  _stopPollster() {
    if (this.get('pollster')) {
      this.get('pollster').stop();
    }
  },

  _filterErrorMessage(mockup) {
    let errorMessage = JSON.parse(mockup.get('error_message'));

    if (errorMessage && errorMessage.indexOf('Traceback') > -1) {
      errorMessage = `Image process of ${mockup.get('name')} is error or has something wrong on server side.`;
    }

    this.sendAction('errorImageProcess', errorMessage);
  },

  actions: {

    retryProcessMockup(mockup) {
      let _self = this;

      _self.get('pollster').stop();
      mockup.save()
        .then(() => {
          _self.get('pollster').start();
        });
    },

    deleteMockup(mockup) {
      let _self = this;

      _self.get('pollster').stop();

      let c = confirm(`Are you sure to delete mockup '${mockup.get('name')}'?`);

      if (c) {
        mockup.deleteRecord();
        mockup.save()
          .then(() => {
            this.sendAction('deleteMockup', `Delete mockup '${mockup.get('name')}' successfully.`)
          });
      }
    }
  }
});