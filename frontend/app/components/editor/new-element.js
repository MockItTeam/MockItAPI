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

      var initSelection = function(obj) {
        // if start new dragging on un-selected, remove all previous selections.
          if (!obj.hasClass('ui-selected')) {
            $('.ui-selected').removeClass('ui-selected');
          }

          // mark new selection
          obj.addClass('ui-selected');
      }

      this.$().draggable({

        stop(event, ui) {
          _self.sendAction('notifyDragged');
        },

        containment: ".droppable-el",

        drag: function (e, ui) {

          var currentLoc = $(this).position();
          var prevLoc = $(this).data('prevLoc');
          if (!prevLoc) {
            prevLoc = ui.originalPosition;
          }

          var ol = currentLoc.left - prevLoc.left;
          var ot = currentLoc.top - prevLoc.top;

          $('.ui-selected').each(function () {
            var p = $(this).position();
            var l = p.left;
            var t = p.top;
            $(this).css('left', l + ol);
            $(this).css('top', t + ot);
          })
          $(this).data('prevLoc', currentLoc);
        },

        start: function(e, ui) {
          initSelection($(this));
        }
      }).click(function() {
        initSelection($(this));
      });

    }
  }
});
