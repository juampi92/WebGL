define(function () {

  var GL,mat4,privates = {};

  function Scene(_GL){
    GL = _GL;
    mat4 = GL.glMatrix.mat4;

    this.camera = null;
    this.models = [];
    this.mvMatrix = GL.glMatrix.mat4.create();
  }
  Scene.prototype.draw = function() {
    this.clear();

    for (var m = 0, max_m = this.models.length; m < max_m; m++) {
      mat4.identity(this.mvMatrix);

      mat4.translate(this.mvMatrix, this.mvMatrix, this.models[m].model.pos);
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.models[m].buffer);
      GL.gl.vertexAttribPointer(GL.shaders.program.vertexPositionAttribute, this.models[m].buffer.itemSize, GL.gl.FLOAT, false, 0, 0);
      this.setMatrixUniforms();
      GL.gl.drawArrays(GL.gl.TRIANGLES, 0, this.models[m].buffer.numItems);
    }

  };
  Scene.prototype.clear = function() {
    GL.gl.viewport(0, 0, GL.gl.viewportWidth, GL.gl.viewportHeight);
    GL.gl.clear(GL.gl.COLOR_BUFFER_BIT | GL.gl.DEPTH_BUFFER_BIT);
  };
  Scene.prototype.addModel = function(model) {
    var _model = { model: model , buffer: null };

    _model.buffer = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, _model.buffer);
    var vertices = [
           0.0,  1.0,  0.0,
          -1.0, -1.0,  0.0,
           1.0, -1.0,  0.0
      ];
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(model.toArray()), GL.gl.STATIC_DRAW);
    _model.buffer.itemSize = model.itemSize();
    _model.buffer.numItems = model.numItems();

    this.models.push(_model);
  };
  Scene.prototype.setCamera = function(camera) {
    this.camera = camera;
  };


  Scene.prototype.setMatrixUniforms = function() {
    GL.gl.uniformMatrix4fv(GL.shaders.program.uPMatrix, false ,this.camera.matrix);
    GL.gl.uniformMatrix4fv(GL.shaders.program.uMVMatrix, false ,this.mvMatrix);
  };

  return {
    Scene: Scene
  };
});