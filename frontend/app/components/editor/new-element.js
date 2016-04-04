import Ember from 'ember';
import Draggable from 'ember-jqueryui/components/ui-draggable';
import ElementFactory from '../../utils/element-factory';

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
    let _self = this;

    if (element.renderable) {
      element.render(this.$());
      this.$().draggable({
        stop(event, ui) {
          var finalxPos = parseInt($(this).css('left'));
          var finalyPos = parseInt($(this).css('top'));

          _self.set('x', finalxPos);
          _self.set('y', finalyPos);

          _self.sendAction('notifyDragged', _self, _self.get('e'));
        }
      })
    }
  }
});
