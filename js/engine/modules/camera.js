define(['engine/modules/matrix'],
function () {

  var GL;

  function Camera(_GL,fov){
    GL = _GL;
    this.fov = (fov)?fov:45;
    this.matrix = new GL.Matrix('mat4');
  }
  Camera.prototype.calculate = function(near,far) {
    this.matrix.perspective(45, GL.gl.viewportWidth / GL.gl.viewportHeight, near, far);
  };

  return {
    Camera: Camera
  };
});
