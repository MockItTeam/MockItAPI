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
    this.get('socketIOService').closeSocketFor('http://localhost:7000');
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
    var enterKey = 13, ctrlKey = 17, commandKey = 91, vKey = 86, cKey = 67, dKey = 68, yKey = 89, zKey = 90, backspaceKey = 8, deleteKey = 46;

    let json_elements = this.get('mockup.json_elements');

    var history = new SimpleUndo({
      maxLength: 20000,
      provider: function (done) {
        let json_elements = self.get('mockup.json_elements');
        done(JSON.stringify(json_elements));
      }
    });
    history.initialize(JSON.stringify(json_elements));
    this.set('history', history);

    $('.is-editor').on( 'click', function (e) {
      let id = $('.text-editable').attr('component_id');
      let text = $('.text-editable textarea').val();
      self._saveTextChange(id,text);
      $('.text-editable textarea').remove();
      $('.text-editable label').show();
      $('.text-editable').removeClass('text-editable');
    });

    $('.is-editor').on('keydown', function (e) {
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
      if (ctrlDown && e.keyCode == zKey) {
        self._undo();
      }
      if (ctrlDown && e.keyCode == yKey) {
        self._redo();
      }

    });

    $('.is-editor').on('keyup', function (e) {
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

    Ember.$('ui-droppable').click( function () {
      $('.ui-selected').removeClass('ui-selected');
    });

    Ember.$('.droppable-el').selectable({
      distance: 1,
      filter: "div"
    });

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
    let history = this.get('history');
    this.set('json_elements', JSON.stringify(json_elements));
    history.save();
  },

  _historyManage(json_elements){
    this.get('socketIORef').emit('message', json_elements);
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
      let temp_id;
      for(var i = 0; i< temp.length; i++){
        temp[i].id = this._findSuitableId(json_elements);
        temp[i].x = temp[i].x + 5;
        temp[i].y = temp[i].y + 5;
        json_elements.elements.push(temp[i]);
        temp_id = temp[i].id;
      }
      this.get('socketIORef').emit('message', json_elements);
      this._saveChangeMockup(json_elements);
    }
  },

  _duplicateMockupComponent(){
    let temp = this._copyMockupComponent();
    this._pasteMockupComponent(temp);
  },

  _saveTextChange(id,text){
    let json_elements = this.get('mockup.json_elements');
    for(var i = 0; i< json_elements.elements.length; i++){
      if(json_elements.elements[i].id == id){
        json_elements.elements[i].text = text;
        break;
      }
    }
    this.get('socketIORef').emit('message', json_elements);
    this._saveChangeMockup(json_elements);
  },

  _undo(){
    let history = this.get('history');
    if(history.canUndo()) {
      let self = this;

      function setJsonElement(json_elements) {
        self._historyManage(JSON.parse(json_elements));
      }
      history.undo(setJsonElement);
    }
  },

  _redo(){
    let history = this.get('history');
    if(history.canRedo()) {
      let self = this;

      function setJsonElement(json_elements) {
        self._historyManage(JSON.parse(json_elements));
      }

      let history = this.get('history');
      history.redo(setJsonElement);
    }
  },

  actions: {
    dropped: Ember.on('willRender', function (event, ui, _self) {
      let self = this;

    }),

    dragged: Ember.on('willRender', function (event, ui, _self) {

    }),

    bringToFront() {
      if($(".ui-selected").length > 0) {
        let json_elements = this.get('mockup.json_elements');
        $(".ui-selected").each(function () {
          for (var i = 0; i < json_elements.elements.length; i++) {
            if (json_elements.elements[i].id == this.getAttribute("component_id")) {
              json_elements.elements[i].z = 100;
            }
          }
        });
        let history = this.get('history');
        history.save();
        this.get('socketIORef').emit('message', json_elements);
      }
    },

    sendToBack() {
      if($(".ui-selected").length > 0) {
        let json_elements = this.get('mockup.json_elements');
        $(".ui-selected").each(function () {
          for (var i = 0; i < json_elements.elements.length; i++) {
            if (json_elements.elements[i].id == this.getAttribute("component_id")) {
              json_elements.elements[i].z = -1;
            }
          }
        });
        let history = this.get('history');
        history.save();
        this.get('socketIORef').emit('message', json_elements);
      }
    },

    toggleRawImage() {
      var img_element = $('.ui-droppable img');
      if(img_element.length == 0) {
        let raw_image = this.get('mockup.raw_image.image_url');
        var img = '<img src="' + raw_image + '">'
        $('.ui-droppable').append(img);
      }
      else{
        if(img_element.is(":visible")) {
          img_element.hide();
        }else{
          img_element.show();
        }
      }
    },

    notifyDragged() {
      let json_elements = this.get('mockup.json_elements');
      for (var i = 0; i < json_elements.elements.length; i++) {
        let element = $("[component_id="+json_elements.elements[i].id+"]");
        let x = parseInt(element.css('left'));
        let y = parseInt(element.css('top'));
        json_elements.elements[i].x = x;
        json_elements.elements[i].y = y;
      }
      let history = this.get('history');
      history.save();
      this.get('socketIORef').emit('message', json_elements);
    },

    notifyResize() {
      let json_elements = this.get('mockup.json_elements');
      for (var i = 0; i < json_elements.elements.length; i++) {
        let element = $("[component_id="+json_elements.elements[i].id+"]");
        let width = parseInt(element.css('width'));
        let height = parseInt(element.css('height'));
        json_elements.elements[i].width = width;
        json_elements.elements[i].height = height;
      }
      let history = this.get('history');
      history.save();
      this.get('socketIORef').emit('message', json_elements);
    },

  }
});
