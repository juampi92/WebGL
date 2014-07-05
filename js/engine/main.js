define(['glMatrix'],
function (glMatrix) {

  var GL_engine = {

    gl: null,

    glMatrix: glMatrix,

    init: function( canvas , width , height ){
      if ( width && height ){
        canvas.width = width;
        canvas.height = height;
      }

      var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
      for (var i = 0; i < names.length; ++i) {
        try {
          this.gl = canvas.getContext(names[i]);
          this.gl.viewportWidth = canvas.width;
          this.gl.viewportHeight = canvas.height;
        } catch(e) {}
        if (this.gl) {
          break;
        }
      }
      if (!this.gl)
        throw "Could not initialise WebGL";
    },

    extend: function(module){
      // Mixin
      if ( typeof module === 'string' )
        module = require('engine/modules/'+module);

      for (var k in module) {
        if (module.hasOwnProperty(k)) {
          this[k] = module[k];
        }
      }
    }
  };

  return GL_engine;
});
