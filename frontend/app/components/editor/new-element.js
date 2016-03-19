import Ember from 'ember';
import Draggable from 'ember-jqueryui/components/ui-draggable';
import ElementFactory from '../../utils/element-factory';
import $ from 'jquery';

export default Draggable.extend({
  classNames: ['new-draggable-el'],

  attributeBindings: [
    'type',
    'checked',
    'disabled',
    'tabindex',
    'name',
    'autofocus',
    'required',
    'form',
    'value'
  ],

  init() {
    this._super(...arguments);
  },

  didInsertElement() {
    let element = ElementFactory.createElement(this.get('e'));
    if (element.renderable) {
      element.render(this.$());
    }
  }
});