define(function () {

  var GL;

  return {
    shaders: {
      program: null,
      attrs: {},
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
      initialize: function(_GL,shdrs,preSet){
        GL = _GL;
        this.program = GL.gl.createProgram();

        var shaders = [],
          i,max_i;

        for (i = 0, max_i = shdrs.length; i < max_i; i++) {
          shaders[i] = this.load(shdrs[i]);
          GL.gl.attachShader(this.program, shaders[i]);
        }

        GL.gl.linkProgram(this.program);

        if (!GL.gl.getProgramParameter(this.program, GL.gl.LINK_STATUS))
            alert("Could not initialise shaders");

        GL.gl.useProgram(this.program);

        for (i = 0, max_i = preSet.length; i < max_i; i++)
          this.set(preSet[i]);
      },
      get: function(attr){
        if ( this.attrs[attr] === undefined ) {
          this.set(attr);
        }
        return this.attrs[attr];
      },
      set: function(attr){
        // Aprovechar practicas
        switch(attr[0]){
        case "u":
          this.attrs[attr] = GL.gl.getUniformLocation(this.program,attr);
          break;
        case "a":
          this.attrs[attr] = GL.gl.getAttribLocation(this.program, attr);
          GL.gl.enableVertexAttribArray(this.attrs[attr]);
          break;
        }
        return this.attrs[attr];
      }
    }
  };
});