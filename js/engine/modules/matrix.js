define(['glMatrix'],
function (glMatrix) {

  function Matrix(type){
    this.type = type;
    this.glM = glMatrix[type];
    this.matrix = this.glM.create();
    this.stack = [];
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
  Matrix.prototype.multiply = function(v) {
    this.glM.multiply(this.matrix,this.matrix, v);
  };

  Matrix.prototype.push = function() {
    var copy = this.glM.create();
    this.glM.copy(copy, this.matrix);
    this.stack.push(copy);
  };
  Matrix.prototype.pop = function() {
    if (this.stack.length === 0)
      throw "Invalid pop Matrix!";
    this.matrix = this.stack.pop();
  };

  return {
    Matrix: Matrix
  };
});
