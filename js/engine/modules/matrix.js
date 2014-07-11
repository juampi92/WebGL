define(['glMatrix'],
function (glMatrix) {

  function Matrix(type){
    this.glM = glMatrix[type];
    this.matrix = this.glM.create();
  }
  Matrix.prototype.get = function() {
    return this.matrix;
  };
  Matrix.prototype.identity = function() {
    this.glM.identity(this.matrix);
  };
  Matrix.prototype.perspective = function(fovy,aspect,near,far) {
    this.glM.perspective(this.matrix, fovy, aspect, near, far);
  };
  Matrix.prototype.translate = function(v) {
    this.glM.translate(this.matrix,this.matrix, v);
  };

  Matrix.prototype.get = function() {
    return this.matrix;
  };

  return {
    Matrix: Matrix
  };
});
