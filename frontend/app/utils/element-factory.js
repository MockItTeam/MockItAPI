class ElementFactory {

  static createElement(obj) {
    switch (obj.type) {
      case "Text":
        return new Label(obj);
      case "VideoPlayer":
        return new VideoPlayer(obj);
      case "TextField":
        return new TextField(obj);
      case "TextArea":
        return new TextArea(obj);
      case "Root":
      default:
        return new NoneElement(obj);
    }
  }

}

class Element {

  constructor(obj) {
    this.id = obj.id;
    this.x = obj.x;
    this.y = obj.y;
    this.z = obj.z+50;
    this.width = obj.width;
    this.height = obj.height;
    this.renderable = true;
    this.text = obj.text;
  }

  render(jquery) {
    jquery.draggable({
      drag: function( event, ui ) {
        // Keep the left edge of the element
        // at least 100 pixels from the container
        // ui.position.left = Math.min( 100, ui.position.left );
      },
      start: function( event, ui ) {
        jquery.addClass("dragging");
      },
      stop: function( event, ui ) {
        jquery.removeClass("dragging");
      }
    }).css({
      'z-index': this.z,
      'top': this.y,
      'left': this.x,
      'width': this.width,
      'height': this.height,
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap'
    }).attr('component_id', this.id);
    ;
  }

}

class NoneElement extends Element {
  constructor(obj) {
    super(obj);
    this.renderable = false;
  }
}

class Label extends Element {

  constructor(obj) {
    super(obj);
    this.text = obj.text;
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      border: "none",
    });
    jquery.addClass('component-text');
    jquery.html('<label style="display: inline-block; text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
  }

}

class VideoPlayer extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      background: "#c2c2c2",
      color: "white",
      border: "none",
      "text-align": "center",
      "font-size": "20px",
      "line-height": this.height + "px"
    });
    jquery.html('<span class="description'+this.id+'">Video Player</span>');
  }

}

class TextField extends Element {

  constructor(obj) {
    super(obj);
    this.text = obj.text;
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      background: "#c2c2c2",
      color: "white",
      border: "none",
      "text-align": "center",
      "font-size": "20px",
      "line-height": this.height + "px"
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "TextField";
    }
    jquery.html('<label style="text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
  }

}

class TextArea extends Element {

  constructor(obj) {
    super(obj);
    this.text = obj.text;
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      background: "#c2c2c2",
      color: "white",
      border: "none",
      "text-align": "center",
      "font-size": "20px",
      "line-height": this.height + "px"
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "TextArea";
    }
    jquery.html('<label style="display: inline-block; text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
  }

}

export default ElementFactory;
