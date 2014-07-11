define(function () {

  var GL,mat4,privates = {};

  function Scene(_GL){
    GL = _GL;
    mat4 = GL.glMatrix.mat4;

    this.camera = null;
    this.models = [];
    this.mvMatrix = GL.glMatrix.mat4.create();
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

      mat4.identity(this.mvMatrix);

      mat4.translate(this.mvMatrix, this.mvMatrix, mdl.model.pos);
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.buffer);
      GL.gl.vertexAttribPointer(GL.shaders.get('aVertexPosition'), mdl.buffer.itemSize, GL.gl.FLOAT, false, 0, 0);

      // Colors
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.color);
      GL.gl.vertexAttribPointer(GL.shaders.get('aVertexColor'), mdl.color.itemSize, GL.gl.FLOAT, false, 0, 0);

      // Apply matrices in program
      this.setMatrixUniforms();
      GL.gl.drawArrays(mdl.drawMode, 0, mdl.buffer.numItems);
    }

  };
  Scene.prototype.clear = function() {
    GL.gl.viewport(0, 0, GL.gl.viewportWidth, GL.gl.viewportHeight);
    GL.gl.clear(GL.gl.COLOR_BUFFER_BIT | GL.gl.DEPTH_BUFFER_BIT);
  };
  Scene.prototype.addModel = function(model) {
    var _model = { model: model , drawMode: 0 , buffer: null , color: null , texture: null };

    // Model Structure
    _model.buffer = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, _model.buffer);
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(model.toArray()), GL.gl.STATIC_DRAW);
    _model.buffer.itemSize = model.itemSize();
    _model.buffer.numItems = model.numItems();

    switch(_model.buffer.numItems){
    case 3:
      _model.drawMode = GL.gl.TRIANGLES;
      break;
    case 4:
      _model.drawMode = GL.gl.TRIANGLE_STRIP;
      break;
    }

    // Model color (has color or texture...)
    _model.color = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, _model.color);
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(model.getColors()), GL.gl.STATIC_DRAW);
    _model.color.itemSize = 4;
    _model.color.numItems = _model.buffer.numItems;

    this.models.push(_model);
  };
  Scene.prototype.setCamera = function(camera) {
    this.camera = camera;
  };


  Scene.prototype.setMatrixUniforms = function() {
    GL.gl.uniformMatrix4fv(GL.shaders.get('uPMatrix'), false ,this.camera.matrix);
    GL.gl.uniformMatrix4fv(GL.shaders.get('uMVMatrix'), false ,this.mvMatrix);
  };

  return {
    Scene: Scene
  };
});