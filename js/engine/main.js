define(['glMatrix'],
function (glMatrix) {

  var GL_engine = {

    gl: null,
    _installed_modules: [],

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
      if ( typeof module === 'string' )
        this._extend(module);
      else
        for (var m = 0, max_m = module.length; m < max_m; m++)
          this._extend(module[m]);
    },
    _extend: function(module){
      if ( this._installed_modules.indexOf(module) > 0 ) return;

      // Mixin
      this._installed_modules.push(module);

      module = require('engine/modules/'+module);

      if ( module.init ) { module.init(this); delete module.init;}

      for (var k in module) {
        if (module.hasOwnProperty(k)) {
          this[k] = module[k];
        }
      }
    }
  };

  return GL_engine;
});
