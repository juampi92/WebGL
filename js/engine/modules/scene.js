define(['engine/modules/matrix'],
function () {

  var GL,mat4,privates = {};

  function Scene(_GL){
    GL = _GL;

    this.camera = null;
    this.models = [];
    this.matrices = {};
    
    this.mvMatrix = new GL.Matrix('mat4');
    this.setUniformMatrix('uMVMatrix',this.mvMatrix);
  }
  Scene.prototype.clean = function(r,g,b) {
    r = r || 0.0; g = g || 0.0; b = b || 0.0;
    GL.gl.clearColor(r,g,b, 1.0);
    GL.gl.enable(GL.gl.DEPTH_TEST);
  };
  
  Scene.prototype.draw = function() {
    this.clear();

    this.mvMatrix.identity();

    var mdl;
    for (var m = 0, max_m = this.models.length; m < max_m; m++) {
      mdl = this.models[m];
      
      this.mvMatrix.push();

      this.applyModelTransformations(mdl.model);
      this.mvMatrix.multiply(mdl.model.state);
      this.drawModel(mdl);

      this.mvMatrix.pop();
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

  // Add Model to the Scene.
  Scene.prototype.addModel = function(mdl) {
    var model = { model: mdl , drawMode: 0 , buffer: null , color: null , texture: null , childrens: null, parent: null };

    // Model Position
    GL.glMatrix.mat4.identity(mdl.state);
    GL.glMatrix.mat4.translate(mdl.state, mdl.state, mdl.startPos);

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
  Scene.prototype.applyModelTransformations = function(model) {
    var cursor;
    for (var i = 0, max_i = model.actions.length; i < max_i; i++) {
      cursor = model.actions[i];
      GL.glMatrix.mat4[cursor[0]](model.state,model.state,cursor[1],cursor[2],cursor[3],cursor[4]);
    }
    model.actions = [];
  };
  
  Scene.prototype.setCamera = function(camera) {
    this.camera = camera;
    this.setUniformMatrix('uPMatrix',this.camera.matrix);
  };
  Scene.prototype.getCamera = function() {
    return this.camera;
  };

  Scene.prototype.setUniformMatrix = function(shaderVar , matrix ) {
    var type;
    switch(matrix.type){
    case 'mat4':
      type = 'uniformMatrix4fv';
      break;
    case 'mat3':
      type = 'uniformMatrix3fv';
      break;
    }

    this.matrices[shaderVar] = {m:matrix , t:type};
  };


  Scene.prototype.setMatrixUniforms = function() {
    var cursor;
    for(var shaderVar in this.matrices) {
      if(this.matrices.hasOwnProperty(shaderVar)) {
        cursor = this.matrices[shaderVar];
        GL.gl[cursor.t](GL.shaders.get(shaderVar),false,cursor.m.get());
      }
    }
  };

  return {
    Scene: Scene
  };
});