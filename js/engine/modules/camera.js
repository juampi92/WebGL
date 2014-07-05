define(['glMatrix'],
function (glMatrix) {

  var GL;

  function Camera(_GL,fov){
    GL = _GL;
    this.fov = (fov)?fov:45;
    this.matrix = glMatrix.mat4.create();
  }
  Camera.prototype.calculate = function(near,far) {
    glMatrix.mat4.perspective(this.matrix, 45, GL.gl.viewportWidth / GL.gl.viewportHeight, near, far);
  };

  return {
    Camera: Camera
  };
});
