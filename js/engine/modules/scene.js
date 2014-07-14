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
  
  Scene.prototype.clear = function() {
    GL.gl.viewport(0, 0, GL.gl.viewportWidth, GL.gl.viewportHeight);
    GL.gl.clear(GL.gl.COLOR_BUFFER_BIT | GL.gl.DEPTH_BUFFER_BIT);
  };

  // ------------------ Add Model to the Scene. -----------------------
  Scene.prototype.addModel = function(mdl) {
    var model = { model: mdl , drawMode: 0 , buffer: null , color: null , texture: null , childrens: null, parent: null, index: null };

    // Model Position
    GL.glMatrix.mat4.identity(mdl.state);
    GL.glMatrix.mat4.translate(mdl.state, mdl.state, mdl.startPos);

    // Model Structure
    model.buffer = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, model.buffer);
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(mdl.toArray()), GL.gl.STATIC_DRAW);
    model.buffer.itemSize = mdl.itemSize();
    model.buffer.numItems = mdl.numItems();

    switch(mdl.polygonSize()){
    case 3:
      model.drawMode = GL.gl.TRIANGLES;
      break;
    case 4:
      model.drawMode = GL.gl.TRIANGLE_STRIP;
      break;
    default:
      throw "Scene addModel unknown drawMode";
    }

    // Model color
    /*model.color = GL.gl.createBuffer();
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, model.color);
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(mdl.getColors()), GL.gl.STATIC_DRAW);
    model.color.itemSize = 4;
    model.color.numItems = model.buffer.numItems;*/

    // Model texture
    //if ( mdl.hasTexture() ) {
      model.texture = GL.gl.createBuffer();
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, model.texture);
      
      // Hardcoded for the moment!
      var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
      ];
      GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(textureCoords), GL.gl.STATIC_DRAW);
      model.texture.itemSize = 2;
      model.texture.numItems = 24;
    //}

    // Index
    if ( mdl.polygonSize() > 3 && mdl.polygonsSize() > 1 ){
      model.index = GL.gl.createBuffer();
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, model.index);
      var cubeVertexIndices = [];
      for (var i = 0, max_i = mdl.polygonsSize() * mdl.polygonSize(); i < max_i; i += mdl.polygonSize() ) {
        cubeVertexIndices = cubeVertexIndices.concat([i,i+1,i+2,i,i+2,i+3]);
      }
      GL.gl.bufferData(GL.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), GL.gl.STATIC_DRAW);
      model.index.itemSize = 1;
      model.index.numItems = 36;
    }

    this.models.push(model);
  };

  // ------------------------- Draw ------------------------------
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
  
  // ---------------------- Draw Model ---------------------------
  Scene.prototype.drawModel = function(mdl) {
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.buffer);
    GL.gl.vertexAttribPointer(GL.shaders.get('aVertexPosition'), mdl.buffer.itemSize, GL.gl.FLOAT, false, 0, 0);

    // Colors
    /*if ( GL.shaders.has('aVertexColor') ) {
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.color);
      GL.gl.vertexAttribPointer(GL.shaders.get('aVertexColor'), mdl.color.itemSize, GL.gl.FLOAT, false, 0, 0);
    }*/

    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, mdl.texture);
    GL.gl.vertexAttribPointer(GL.shaders.get('aTextureCoord'), mdl.texture.itemSize, GL.gl.FLOAT, false, 0, 0);

    GL.gl.activeTexture(GL.gl.TEXTURE0);
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, GL.textures.get('woodceiling1a.jpg'));
    GL.gl.uniform1i(GL.shaders.get('uSampler'), 0);

    // Apply matrices in program
    if ( mdl.index ) {
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, mdl.index); // WARNING
      this.setMatrixUniforms();
      GL.gl.drawElements(GL.gl.TRIANGLES, mdl.index.numItems, GL.gl.UNSIGNED_SHORT, 0);
    } else {
      this.setMatrixUniforms();
      GL.gl.drawArrays(mdl.drawMode, 0, mdl.buffer.numItems);
    }
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
    default:
      throw "Scene setUniformMatrix unknown type";
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