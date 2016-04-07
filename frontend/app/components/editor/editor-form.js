import Ember from 'ember';

export default Ember.Component.extend({

  /*
   * 1) First step you need to do is inject the websocket service into your object.
   */
  socketIOService: Ember.inject.service('socket-io'),
  socketIORef: null,

  willRender() {
    /*
     * 2) The next step you need to do is to create your actual websocket. Calling socketFor
     * will retrieve a cached websocket if one exists or in this case it
     * will create a new one for us.
     */
    const socket = this.get('socketIOService').socketFor('http://localhost:7000');

    /*
     * 3) The next step is to define your event handlers. All event handlers
     * are added via the `on` method and take 3 arguments: event name, callback
     * function, and the context in which to invoke the callback. All 3 arguments
     * are required.
     */
    socket.on('connect', this.onConnect, this);
    socket.on('message', this.onMessage, this);

    this.set('socketIORef', socket);
  },

  willDestroyElement() {
    const socket = this.get('socketIORef');

    /*
     * 4) The final step is to remove all of the listeners you have setup.
     */
    socket.off('connect', this.onConnect);
    socket.off('message', this.onMessage);
    socket.emit('leave room');
  },

  onConnect() {
    const socket = this.get('socketIORef');

    socket.emit('create room', this.get('mockup.id'));
  },

  onMessage(data) {
    this._saveChangeMockup(data);
  },

  actions: {
    dropped: Ember.on('willRender', function (event, ui, _self) {
      let self = this;
      _self.$().droppable({
        accept: '.draggable-el',
        drop(event, ui) {
          let json = { "id":1000,
            "type":"TextArea",
            "x":ui.position.left,
            "y":ui.position.top,
            "z":1,
            "width":ui.draggable.children().css('width'),
            "height":ui.draggable.children().css('height'),
            "children_id":[]
          };

          let json_elements = self.get('mockup.json_elements');
          json_elements.elements.push(json);
          self.get('socketIORef').emit('message', json_elements);
          self._saveChangeMockup(json_elements);

          // console.log(ui.width);
          // var newClone = ui.helper
          //   .clone()
          //   .removeClass('draggable-el')
          //   .addClass('new-draggable-el')
          //   .draggable({
          //     drag: function (e, ui) {
          //       var currentLoc = $(this).position();
          //       var prevLoc = $(this).data('prevLoc');
          //       if (!prevLoc) {
          //         prevLoc = ui.originalPosition;
          //       }
          //
          //       var ol = currentLoc.left-prevLoc.left;
          //       var ot = currentLoc.top-prevLoc.top;
          //
          //       $('.ui-selected').each(function () {
          //         var p = $(this).position();
          //         var l = p.left;
          //         var t = p.top;
          //         $(this).css('left', l + ol);
          //         $(this).css('top', t + ot);
          //       })
          //       $(this).data('prevLoc', currentLoc);
          //     }
          //   });
          // $(this).append(newClone);
        }
      });
      _self.$().selectable({
        // stop: function() {
        //   $('.ui-selectee', this).each(function(){
        //     if ($('.ui-selectee').parent().is( 'div' ) ) {
        //       $('.ui-selectee li').unwrap('<div />');
        //     }
        //
        //
        //   });
        //
        //   $('.ui-selected').wrapAll('<div class=\"draggable\" />');
        //
        //   // $('.draggable').draggable({ revert : true });
        // }
      });
    }),

    dragged: Ember.on('willRender', function (event, ui, _self) {

    }),

    notifyDragged(element, old_element) {
      let json_elements = this.get('mockup.json_elements');
      for (var i = 0; i < json_elements.elements.length; i++) {
        if (json_elements.elements[i].id == old_element.id) {
          json_elements.elements[i].x = element.get('x');
          json_elements.elements[i].y = element.get('y');
          break;
        }
      }

      this.get('socketIORef').emit('message', json_elements);
    }
  },

  _saveChangeMockup(json_elements) {
    let mockup = this.get('mockup');
    mockup.set('json_elements', JSON.stringify(json_elements));
    mockup.save();
    mockup.set('json_elements', json_elements);
  }
});
