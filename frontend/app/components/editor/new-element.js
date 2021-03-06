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
        _self.sendAction('notifySaveTextChange')
        if (!obj.hasClass('ui-selected')) {
          $('.ui-selected').removeClass('ui-selected');
        }

        // mark new selection
        obj.addClass('ui-selected');
      };

      this.$().dblclick(function () {
        if($(this).hasClass('component-text') && !$(this).hasClass('text-editable')) {
          if (!$(this).hasClass('text-editable')) {
            $('.text-editable textarea').remove();
            $('.text-editable label').show();
            $('.text-editable').removeClass('text-editable');
          }
          $(this).addClass('text-editable');
          $('.description' + $(this).attr('component_id')).hide();
          var textArea = '<textarea class="edit-area" style="margin:0px -10px 0px -10px;box-sizing:border-box; color: black; left: 0px; top: 0px; width: ' + $(this).css('width') + '; height: ' + $(this).css('height') + ';">' + $(this).text() + '</textarea>';
          $('.text-editable').append(textArea);
          $('.text-editable textarea').click(function (event) {
            event.stopPropagation();
          });
          $('.text-editable textarea').on('keydown', function (event) {
            event.stopPropagation();
          });
        }
      });

      this.$().resizable({
        autoHide: true,
        stop(event, ui) {
          _self.sendAction('notifyResize');
        }
      });

      this.$().draggable({
        scroll: true,
        stop(event, ui) {
          _self.sendAction('notifyDragged');
        },

        containment: ".html-div",

        drag: function (e, ui) {
          var scrollTop = $('.editor-canvas-wrapper').scrollTop();
          var scrollLeft = $('.editor-canvas-wrapper').scrollLeft();
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
            var left = l + ol + (scrollLeft);
            var top = t + ot + (scrollTop);
            $(this).css('left', left);
            $(this).css('top', top);
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
