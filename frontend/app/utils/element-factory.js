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
    this.x = obj.x;
    this.y = obj.y;
    this.z = obj.z;
    this.width = obj.width;
    this.height = obj.height;
    this.renderable = true;
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
      'height': this.height
    });
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
    jquery.text(this.text);
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
    jquery.text("Video Player");
  }

}

class TextField extends Element {

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
    jquery.text("TextField");
  }

}

class TextArea extends Element {

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
    jquery.text("TextArea");
  }

}

export default ElementFactory;
