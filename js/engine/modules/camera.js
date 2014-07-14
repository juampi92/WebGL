define(['glMatrix','engine/modules/matrix'],
function (glMatrix) {

  var GL;

  function Camera(fov){
    this.fov = (fov)?fov:45;
    this.matrix = new GL.Matrix('mat4');
    this.scene = null;
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

  return {
    init: function(_GL){GL = _GL;},
    Camera: Camera
  };
});
