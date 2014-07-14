define(['glMatrix','engine/modules/matrix'],
function (glMatrix) {

  var GL;

  function Camera(fov){
    this.fov = (fov)?fov:45;
    this.matrix = new GL.Matrix('mat4');
    this.scene = null;

    this.coords = [0,0,0];
    this.rotation = [0,0,0];

    this.state = [];
    this._lastAction = false;
  }
  Camera.prototype.calculate = function(near,far) {
    this.matrix.perspective(45, GL.gl.viewportWidth / GL.gl.viewportHeight, near, far);
  };

  Camera.prototype.getView = function() {
    return this.scene.mvMatrix; // Model View Matrix
  };
  Camera.prototype.setScene = function(scn) {
    this.scene = scn;
  };

  // Position rules
  Camera.prototype.move = function(pos) {
    this.coords[0] += pos[0];
    this.coords[1] += pos[1];
    this.coords[2] += pos[2] || 0;
    this._lastAction = true;
  };
  Camera.prototype.rotate = function(axis) {
    this.rotation[0] += axis[0];
    this.rotation[1] += axis[1];
    this.rotation[2] += axis[2] || 0;
    this._lastAction = true;
  };
  Camera.prototype.getX = function() { return this.coords[0]; };
  Camera.prototype.getY = function() { return this.coords[1]; };
  Camera.prototype.getZ = function() { return this.coords[2]; };

  Camera.prototype.getRotX = function() { return this.rotation[0]; };
  Camera.prototype.getRotY = function() { return this.rotation[1]; };
  Camera.prototype.getRotZ = function() { return this.rotation[2]; };

  Camera.prototype.posRestart = function() {
    this.coords = [0,0,0];
    this.rotation = [0,0,0];
    this.state = [];
    this._lastAction = true;
  };

  return {
    init: function(_GL){GL = _GL;},
    Camera: Camera
  };
});
