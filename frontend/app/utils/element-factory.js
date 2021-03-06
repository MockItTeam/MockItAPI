class ElementFactory {

  static createElement(obj) {
    switch (obj.type) {
      case "TextLabel":
        return new Label(obj);
      case "VideoPlayer":
        return new VideoPlayer(obj);
      case "TextField":
        return new TextField(obj);
      case "TextArea":
        return new TextArea(obj);
      case "Panel":
        return new Panel(obj);
      case "Button":
        return new Button(obj);
      case "Graph":
        return new Graph(obj);
      case "Checkbox":
      return new Checkbox(obj);
      case "RadioButton":
        return new RadioButton(obj);
      case "Dropdown":
        return new Dropdown(obj);
      case "Table":
        return new Table(obj);
      case "Calendar":
        return new Calendar(obj);
      case "Image":
        return new ImagePlaceholder(obj);
      case "Link":
        return new Link(obj);
      case "Map":
        return new Map(obj);
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
    this.z = obj.z + 70;
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      border: "none",
      "text-align": "left",
      "font-size": "18px",
      "padding" : "0px 10px 0px 10px",
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "TextLabel";
    }
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
      'background-image': "url('/assets/component/videoplayer.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
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
      background: "white",
      color: "#2e2e2e",
      "border-color": "#2e2e2e",
      "border-style": "solid",
      "border-width": "3px",
      "text-align": "left",
      "font-size": "18px",
      "padding" : "0px 10px 0px 10px",
      "line-height": this.height + "px",
      "border-radius": "5px",
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "TextField";
    }
    jquery.html('<label style="display: inline-block; text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
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
      background: "white",
      color: "#2e2e2e",
      "border-color": "#2e2e2e",
      "border-style": "solid",
      "border-width": "3px",
      "text-align": "left",
      "font-size": "20px",
      "padding" : "0px 10px 0px 10px",
      "border-radius": "5px",
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "TextArea";
    }
    jquery.html('<label style="display: inline-block; text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
  }

}

class Panel extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      background: "white",
      "border-color": "#2e2e2e",
      "border-style": "solid",
      "border-width": "3px",
      "border-radius": "5px",
    });
  }

}

class Button extends Element {

  constructor(obj) {
    super(obj);
    this.text = obj.text;
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      background: "white",
      color: "#2e2e2e",
      "border-color": "#2e2e2e",
      "border-style": "solid",
      "border-width": "3px",
      "text-align": "center",
      "font-size": "18px",
      "padding" : "0px 10px 0px 10px",
      "line-height": this.height + "px",
      "border-radius": "5px",
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "Button";
    }
    jquery.html('<label style="display: inline-block; text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
  }

}

class Graph extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/graph.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class Checkbox extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/checkbox.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class RadioButton extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/radio.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class Dropdown extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/dropdown.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class Table extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/table.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class Calendar extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/calendar.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class ImagePlaceholder extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/image.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

class Link extends Element {

  constructor(obj) {
    super(obj);
    this.text = obj.text;
    this.z = obj.z;
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      border: "none",
      "text-align": "left",
      "font-size": "18px",
      "color": "#6f9fcd",
      "padding" : "0px 10px 0px 10px",
    });
    jquery.addClass('component-text');
    if(!this.text){
      this.text = "Link";
    }
    jquery.html('<label style="display: inline-block; text-decoration: underline; text-overflow: ellipsis; overflow: hidden" class="description'+this.id+'">'+this.text+'</label>');
  }

}

class Map extends Element {

  constructor(obj) {
    super(obj);
  }

  render(jquery) {
    super.render(jquery);
    jquery.css({
      'background-image': "url('/assets/component/map.png')",
      'background-repeat': "no-repeat",
      'background-size' : "100% 100%",
      border: "none",
    });
  }

}

export default ElementFactory;
