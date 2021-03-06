import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('sessions.new', {path: '/signin'});
  this.route('registrations.new', {path: '/signup'});

  this.route('protected', {path: '/app'}, function() {
    // Project route
    this.route('projects', function() {
      this.route('index', {path: ''});

      this.route('detail', {path: '/:project_id'}, function() {
        this.route('mockups', function() {
          this.route('detail', {path: '/:mockup_id'});
        });
        this.route('members');
      });

      this.route('new', {path: '/create'});
      this.route('edit', {path: '/edit/:project_id'});
    });
  });
});

export default Router;
