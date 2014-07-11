define(['engine/modules/matrix'],
function () {

  var GL,mat4,privates = {};

  function Scene(_GL){
    GL = _GL;

    this.camera = null;
    this.models = [];
    this.mvMatrix = new GL.Matrix('mat4');
  }
  Scene.prototype.clean = function(r,g,b) {
    r = r || 0.0; g = g || 0.0; b = b || 0.0;
    GL.gl.clearColor(r,g,b, 1.0);
    GL.gl.enable(GL.gl.DEPTH_TEST);
  };
  
  Scene.prototype.draw = function() {
    this.clear();

    var mdl;
    for (var m = 0, max_m = this.models.length; m < max_m; m++) {
      mdl = this.models[m];

      this.mvMatrix.identity();

      this.mvMatrix.translate(mdl.model.pos);
      
      this.drawModel(mdl);
    }

  };
  
  Scene.prototype.drawModel = function(mdl) {
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.buffer);
    GL.gl.vertexAttribPointer(GL.shaders.get('aVertexPosition'), mdl.buffer.itemSize, GL.gl.FLOAT, false, 0, 0);

    // Colors
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.color);
    GL.gl.vertexAttribPointer(GL.shaders.get('aVertexColor'), mdl.color.itemSize, GL.gl.FLOAT, false, 0, 0);

    // Apply matrices in program
    this.setMatrixUniforms();
    GL.gl.drawArrays(mdl.drawMode, 0, mdl.buffer.numItems);
  };
  
  Scene.prototype.clear = function() {
    GL.gl.viewport(0, 0, GL.gl.viewportWidth, GL.gl.viewportHeight);
    GL.gl.clear(GL.gl.COLOR_BUFFER_BIT | GL.gl.DEPTH_BUFFER_BIT);
  };
  
  Scene.prototype.addModel = function(mdl) {
    var model = { model: mdl , drawMode: 0 , buffer: null , color: null , texture: null };

    // Model Structure
    model.buffer = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, model.buffer);
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(mdl.toArray()), GL.gl.STATIC_DRAW);
    model.buffer.itemSize = mdl.itemSize();
    model.buffer.numItems = mdl.numItems();

    switch(model.buffer.numItems){
    case 3:
      model.drawMode = GL.gl.TRIANGLES;
      break;
    case 4:
      model.drawMode = GL.gl.TRIANGLE_STRIP;
      break;
    }

    // Model color (has color or texture...)
    model.color = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, model.color);
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(mdl.getColors()), GL.gl.STATIC_DRAW);
    model.color.itemSize = 4;
    model.color.numItems = model.buffer.numItems;

    this.models.push(model);
  };
  
  Scene.prototype.setCamera = function(camera) {
    this.camera = camera;
  };


  Scene.prototype.setMatrixUniforms = function() {
    GL.gl.uniformMatrix4fv(GL.shaders.get('uPMatrix'), false ,this.camera.matrix.get());
    GL.gl.uniformMatrix4fv(GL.shaders.get('uMVMatrix'), false ,this.mvMatrix.get());
  };

  return {
    Scene: Scene
  };
});