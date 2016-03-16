import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({

  activate() {
    $('html').attr('class', 'layout-frontend is-project');
  }
});