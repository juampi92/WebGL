define(['engine/modules/models'],
function () {

  var GL = null;

  function Box(dim){
    if ( !GL ) throw "Shape not initialized. Do shape.init(GL) first";

    dim = dim || 1;

    var cubo = new GL.Model(),
        polygons = [],
        vertices = [];

      vertices[0] = new GL.Vertex( -dim,  -dim,  dim);
      vertices[1] = new GL.Vertex(  dim,  -dim,  dim);
      vertices[2] = new GL.Vertex(  dim,   dim,  dim);
      vertices[3] = new GL.Vertex( -dim,   dim,  dim);
      vertices[4] = new GL.Vertex( -dim,  -dim, -dim);
      vertices[5] = new GL.Vertex( -dim,   dim, -dim);
      vertices[6] = new GL.Vertex(  dim,   dim, -dim);
      vertices[7] = new GL.Vertex(  dim,  -dim, -dim);

      // Front Face
      polygons[0] = new GL.Polygon();
      polygons[0].addVertex(vertices[0]);
      polygons[0].addVertex(vertices[1]);
      polygons[0].addVertex(vertices[2]);
      polygons[0].addVertex(vertices[3]);
      cubo.addPolygon(polygons[0]);

      // Back Face
      polygons[1] = new GL.Polygon();
      polygons[1].addVertex(vertices[4]);
      polygons[1].addVertex(vertices[5]);
      polygons[1].addVertex(vertices[6]);
      polygons[1].addVertex(vertices[7]);
      cubo.addPolygon(polygons[1]);

      // Top Face
      polygons[2] = new GL.Polygon();
      polygons[2].addVertex(vertices[5]);
      polygons[2].addVertex(vertices[3]);
      polygons[2].addVertex(vertices[2]);
      polygons[2].addVertex(vertices[6]);
      cubo.addPolygon(polygons[2]);

      // Bottom Face
      polygons[3] = new GL.Polygon();
      polygons[3].addVertex(vertices[4]);
      polygons[3].addVertex(vertices[7]);
      polygons[3].addVertex(vertices[1]);
      polygons[3].addVertex(vertices[0]);
      cubo.addPolygon(polygons[3]);

      // Right Face
      polygons[4] = new GL.Polygon();
      polygons[4].addVertex(vertices[7]);
      polygons[4].addVertex(vertices[6]);
      polygons[4].addVertex(vertices[2]);
      polygons[4].addVertex(vertices[1]);
      cubo.addPolygon(polygons[4]);

      // Left Face
      polygons[5] = new GL.Polygon();
      polygons[5].addVertex(vertices[4]);
      polygons[5].addVertex(vertices[0]);
      polygons[5].addVertex(vertices[3]);
      polygons[5].addVertex(vertices[5]);
      cubo.addPolygon(polygons[5]);

      return cubo;
  }


  function Sphere(){
    if ( !GL ) throw "Shape not initialized. Do shape.init(GL) first";

  }

  return {
    init: function(_GL){GL = _GL;},
    shape: {
      Box: Box,
      Sphere: Sphere
    }
  };
});