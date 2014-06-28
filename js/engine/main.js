define(['glMatrix'],
function (glMatrix) {

  var GL_engine = {
    gl: null,
    init: function( canvas , width , height ){
      if ( width && height ){
        canvas.width = width;
        canvas.height = height;
      }

      try {
        this.gl = canvas.getContext('webgl');
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
      } catch(e) { console.log(e); }
      
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
