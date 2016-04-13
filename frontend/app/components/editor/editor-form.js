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

  _findSuitableId(){
    let json_elements = this.get('mockup.json_elements');
    let id = 0;
    let check = false;
    while (!check) {
      id++;
      check = true;
      for (var i = 0; i < json_elements.elements.length; i++) {
        if (json_elements.elements[i].id == id) {
          check = false;
          break;
        }
      }
    }
    return id;
  },

  didInsertElement() {
    let self = this;

    Ember.$('body').on('keydown', function (e) {
      e.preventDefault();
      // detect backspace and delete
      if (e.which == 8 || e.which == 46) {
        self._removeMockupComponent();
      }
    });

    Ember.$('.droppable-el').droppable({
        accept: '.draggable-el',
        drop(event, ui) {
          let json = {
            "id": self._findSuitableId(),
            "type": "TextArea",
            "x": ui.position.left,
            "y": ui.position.top,
            "z": 1,
            "width": ui.draggable.children().css('width'),
            "height": ui.draggable.children().css('height'),
            "children_id": []
          };

          let json_elements = self.get('mockup.json_elements');
          json_elements.elements.push(json);
          self.get('socketIORef').emit('message', json_elements);
          self._saveChangeMockup(json_elements);
        }
      });
    Ember.$('.droppable-el').selectable();

  },

  mockupObserver: Ember.observer(
    'json_elements',
    function() {
      let mockup = this.get('mockup');
      if(mockup.get('hasDirtyAttributes')) {
        //set json_elements for record in database
        mockup.set('json_elements', this.get('json_elements'));
        mockup.save();
        //set json_elements for use in editor
        mockup.set('json_elements', JSON.parse(mockup.get('json_elements')));
      }
    }
  ),

  _saveChangeMockup(json_elements) {
    let mockup = this.get('mockup');
    this.set('json_elements', JSON.stringify(json_elements));
  },

  _removeMockupComponent(){
    console.log('ice');
    $(".ui-selected").each(function(){
      console.log(this.id);
    });
  },

  actions: {
    dropped: Ember.on('willRender', function (event, ui, _self) {
      let self = this;
      
    }),

    dragged: Ember.on('willRender', function (event, ui, _self) {

    }),

    notifyDragged() {
      let json_elements = this.get('mockup.json_elements');
      for (var i = 0; i < json_elements.elements.length; i++) {
        let element = $("[component_id="+json_elements.elements[i].id+"]");
        let x = parseInt(element.css('left'));
        let y = parseInt(element.css('top'));
        json_elements.elements[i].x = x;
        json_elements.elements[i].y = y;
      }
      this.get('socketIORef').emit('message', json_elements);
    }
  }
});
