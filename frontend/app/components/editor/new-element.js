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
          _self.sendAction('notifyDragged');
        },

        drag: function (e, ui) {
          var currentLoc = $(this).position();
          var prevLoc = $(this).data('prevLoc');
          if (!prevLoc) {
            prevLoc = ui.originalPosition;
          }

          var ol = currentLoc.left-prevLoc.left;
          var ot = currentLoc.top-prevLoc.top;

          $('.ui-selected').each(function () {
            var p = $(this).position();
            var l = p.left;
            var t = p.top;
            $(this).css('left', l + ol);
            $(this).css('top', t + ot);
          })
          $(this).data('prevLoc', currentLoc);
        }

      });

      this.$().bind( "mousedown", function ( e ) {
        if($('.ui-selected').length <= 1){
          $(this).addClass('ui-selected');
          $('.ui-selected').removeClass('ui-selected');
          $(this).addClass('ui-selected');
        }
      });

      this.$().bind( "click", function ( e ) {
        if($(this).hasClass('dragging')){
          $(this).addClass('ui-selected');
        }
        if($(this).hasClass('ui-selected')){
          if(!$(this).hasClass('ui-draggable-dragging')) {
            $('.ui-selected').removeClass('ui-selected');
            $(this).addClass('ui-selected');
          }
        }
        else{
          if(!$(this).hasClass('ui-draggable-dragging')) {
            $('.ui-selected').removeClass('ui-selected');
          }
          $(this).addClass('ui-selected');
        }
      });
    }
  }
});
