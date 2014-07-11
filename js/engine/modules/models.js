define(function () {

  // Model
  function Model(){
    this.polygons = [];
    this.pos = [];
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
  Model.prototype.toArray = function() {
    var ret = [];
    for (var i = 0, max_i = this.polygons.length; i < max_i; i++) {
      ret = ret.concat(this.polygons[i].toArray());
    }
    return ret;
  };
  Model.prototype.setPos = function(pos) {
    this.pos = pos;
  };
  Model.prototype.getColors = function() {
    var ret = [];
    for (var i = 0, max_i = this.polygons.length; i < max_i; i++) {
      ret = ret.concat(this.polygons[i].getColor());
    }
    return ret;
  };


  // Polygon
  function Polygon(type){
    this.type = type;
    this.vertices = [];
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
    for (var i = 0, max_i = this.vertices.length; i < max_i; i++)
      this.vertices[i].setColor(r,g,b,a);
  };
  Polygon.prototype.getColor = function() {
    var ret = [];
    for (var i = 0, max_i = this.vertices.length; i < max_i; i++) {
      ret = ret.concat(this.vertices[i].getColor());
    }
    return ret;
  };


  // Vertex
  function Vertex(x,y,z,color){
    this.coords = [x,y,z];
    this.color = color || [];
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
