define(function () {

  // Model
  function Model(){
    this.polygons = [];
    
    this.startPos = []; // Ubicación inicial del objeto (no necesario en el futuro en realidad)

    this.state = []; // Current position of the model in the screen
    this.actions = []; // Actions to apply to the state before it's drawn.

    this._hasTexture = null;
  }
  Model.prototype.addPolygon = function(polygon){
    this.polygons.push(polygon);
  };
  Model.prototype.numItems = function() {
    var ret = 0;
    for (var i = 0, max_i = this.polygons.length; i < max_i; i++) {
      ret += this.polygons[i].verticesCount();
    }
    return ret;
  };
  Model.prototype.itemSize = function() {
    return this.polygons[0].vertices[0].coords.length;
  };
  Model.prototype.polygonSize = function() {
    return this.polygons[0].vertices.length;
  };
  Model.prototype.polygonsSize = function() {
    return this.polygons.length;
  };
  Model.prototype.toArray = function() {
    var ret = [];
    for (var i = 0, max_i = this.polygons.length; i < max_i; i++) {
      ret = ret.concat(this.polygons[i].toArray());
    }
    return ret;
  };
  Model.prototype.setPos = function(pos) {
    this.startPos = pos;
  };
  
  Model.prototype.getColors = function() {
    var ret = [];
    for (var i = 0, max_i = this.polygons.length; i < max_i; i++) {
      ret = ret.concat(this.polygons[i].getColor());
    }
    return ret;
  };
  Model.prototype.apply = function(action,a,b,c,d) {
    this.actions.push([action,a,b,c,d]);
  };
  Model.prototype.hasTexture = function() {
    if ( this._hasTexture === null ) {
      for (var i = 0, max_i = this.polygons.length; i < max_i && !this._hasTexture; i++)
        if ( this.polygons[i].texture !== null ) this._hasTexture = true;

      if ( this._hasTexture === null ) this._hasTexture = false;
    }
    return this._hasTexture;
  };


  // Polygon
  function Polygon(type){
    this.type = type;
    this.vertices = [];
    this.color = null;
    this.texture = null;
  }
  Polygon.prototype.addVertex = function(v) {
    this.vertices.push(v);
  };
  Polygon.prototype.toArray = function() {
    var ret = [];
    for (var i = 0, max_i = this.vertices.length; i < max_i; i++) {
      ret = ret.concat(this.vertices[i].toArray());
    }
    return ret;
  };
  Polygon.prototype.verticesCount = function() {
    return this.vertices.length;
  };
  Polygon.prototype.setColor = function(r,g,b,a) {
    a = (a !== undefined)? a : 1.0;
    this.color = [r,g,b,a];
  };
  Polygon.prototype.getColor = function() {
    var ret = [],
      i,max_i;
    if ( !this.color )
      for (i = 0, max_i = this.vertices.length; i < max_i; i++) {
        ret = ret.concat(this.vertices[i].getColor());
      }
    else
      for (i = 0, max_i = this.vertices.length; i < max_i; i++) {
        ret = ret.concat(this.color);
      }
    return ret;
  };
  Polygon.prototype.setTexture = function(textur) {
    this.texture = textur;
  };
  Polygon.prototype.getTexture = function() {
    return this.texture;
  };


  // Vertex
  function Vertex(x,y,z,color){
    this.coords = [x,y,z];
    this.color = color || [0,0,0,1];
    if ( this.color[3] === undefined ) this.color[3] = 1;
  }
  Vertex.prototype.toArray = function() {
    return this.coords;
  };
  Vertex.prototype.setColor = function(r,g,b,a) {
    a = (a !== undefined)? a : 1.0;
    this.color = [r,g,b,a];
  };
  Vertex.prototype.getColor = function() {
    return this.color;
  };

  return {
    models: [],
    Model: Model,
    Polygon: Polygon,
    Vertex: Vertex
  };
});
