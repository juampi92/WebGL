define(function () {

  var GL;

  return {
    shaders: {
      program: null,
      load: function(name){
          var str = require('text!engine/shaders/' + name + '.shdr'),
            shader,type;

        str = str.split('\n');
        type = str.shift().trim();
        str = str.join('\n');

        switch(type){
          case "x-shader/x-fragment":
            shader = GL.gl.createShader(GL.gl.FRAGMENT_SHADER);
          break;
          case "x-shader/x-vertex":
            shader = GL.gl.createShader(GL.gl.VERTEX_SHADER);
          break;
          default:
            return null;
        }

        GL.gl.shaderSource(shader,str);
        GL.gl.compileShader(shader);

        if (!GL.gl.getShaderParameter(shader,GL.gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
      },
      initialize: function(_GL,shdrs,variables){
        GL = _GL;
        this.program = GL.gl.createProgram();

        var shaders = [],
          i;

        for (i = 0, max_i = shdrs.length; i < max_i; i++) {
          shaders[i] = this.load(shdrs[i]);
          GL.gl.attachShader(this.program, shaders[i]);
        }

        GL.gl.linkProgram(this.program);

        if (!GL.gl.getProgramParameter(this.program, GL.gl.LINK_STATUS))
            alert("Could not initialise shaders");

        GL.gl.useProgram(this.program);

        this.program.vertexPositionAttribute = GL.gl.getAttribLocation(this.program, "aVertexPosition");
        GL.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);

        for (i = 0, max_i = variables.length; i < max_i; i++) {
          this.program[variables[i]] = GL.gl.getUniformLocation(this.program, variables[i]);
        }
      }
    }
  };
});