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
      _self.$().droppable({
        accept: '.draggable-el',
        drop(event, ui) {
          var newClone = ui.helper
            .clone()
            .removeClass('draggable-el')
            .addClass('new-draggable-el')
            .draggable();

          $(this).append(newClone);
        }
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
    mockup.save().then(() => {

    }, () => {

    });
    mockup.set('json_elements', json_elements);
  }
});
