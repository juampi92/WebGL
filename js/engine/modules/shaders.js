define(function () {

  var GL;

  return {
    init: function(_GL){GL = _GL;},
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
            throw "Shaders load unkown type";
        }

        GL.gl.shaderSource(shader,str);
        GL.gl.compileShader(shader);

        if (!GL.gl.getShaderParameter(shader,GL.gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
      },
      initialize: function(shdrs,preSet){
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

        if ( preSet )
          for (i = 0, max_i = preSet.length; i < max_i; i++)
            this.set(preSet[i]);
      },
      has: function(attr){
        return (this.get(attr) != -1);
      },
      get: function(attr){
        if ( this.attrs[attr] === undefined )
          return this.set(attr);
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
          if ( this.attrs[attr] === -1 ) return -1;
          GL.gl.enableVertexAttribArray(this.attrs[attr]);
          break;
        }
        return this.attrs[attr];
      }
    }
  };
});