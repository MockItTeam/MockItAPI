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

  _findSuitableId(json_elements){
    let id = 0;
    let check = false;
    while (!check) {
      id++;
      check = true;
      console.log(json_elements.elements);
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
    var ctrlDown = false;
    var temp;
    var ctrlKey = 17, commandKey = 91, vKey = 86, cKey = 67, dKey = 68, backspaceKey = 8, deleteKey = 46;
    Ember.$('body').on('keydown', function (e) {
      e.preventDefault();
      if (e.which == backspaceKey || e.which == deleteKey) {
        self._removeMockupComponent();
      }
      if (e.keyCode == ctrlKey || e.keyCode == commandKey) {
        ctrlDown = true;
      }
      if (ctrlDown && e.keyCode == cKey) {
        temp = self._copyMockupComponent();
      }
      if (ctrlDown && e.keyCode == vKey) {
        self._pasteMockupComponent(temp);
      }
      if (ctrlDown && e.keyCode == dKey) {
        self._duplicateMockupComponent();
      }

    });

    Ember.$('body').on('keyup', function (e) {
      e.preventDefault();
      if(e.keyCode == ctrlKey || e.keyCode == commandKey){
        ctrlDown = false;
      }
    });

    Ember.$('.droppable-el').droppable({
        accept: '.draggable-el',
        drop(event, ui) {
          let json = {
            "id": self._findSuitableId(self.get('mockup.json_elements')),
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
    let json_elements = this.get('mockup.json_elements');
    $(".ui-selected").each(function(){
      for (var i = 0; i < json_elements.elements.length; i++) {
        if(json_elements.elements[i].id == this.getAttribute("component_id")){
          json_elements.elements.splice(i,1);
          break;
        }
      }
    });
    this.get('socketIORef').emit('message', json_elements);
    this._saveChangeMockup(json_elements);
  },

  _copyMockupComponent(){
    let json_elements = this.get('mockup.json_elements');
    let list = [];
    $(".ui-selected").each(function(){
      let temp;
      for (var i = 0; i < json_elements.elements.length; i++) {
        if(json_elements.elements[i].id == this.getAttribute("component_id")){
          temp = JSON.parse(JSON.stringify(json_elements.elements[i]));
        }
      }
      list.push(temp);
    });
    return list;
  },

  _pasteMockupComponent(temp){
    if(temp.length != 0){
      let json_elements = this.get('mockup.json_elements');
      for(var i = 0; i< temp.length; i++){
        temp[i].id = this._findSuitableId(json_elements);
        temp[i].x = temp[i].x + 5;
        temp[i].y = temp[i].y + 5;
        json_elements.elements.push(temp[i]);
      }
      this.get('socketIORef').emit('message', json_elements);
      this._saveChangeMockup(json_elements);
    }
  },

  _duplicateMockupComponent(){
    let temp = this._copyMockupComponent();
    this._pasteMockupComponent(temp);
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
