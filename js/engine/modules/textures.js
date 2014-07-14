define(function () {

  // Private vars
  var GL,parent,
    current = 0,
    total = 0;

  // Private methods
  function loaded(texture){
      texture.ready = true;
      current++;

      if ( textures.loader.oneachload !== null )
        textures.loader.oneachload(texture.name,current,total);

      if ( current >= total && textures.loader.onload !== null ) {
        total = current = 0;
        textures.loader.onload();
      }
  }

  var textures = {
    map: {},
    loader: {
      onload: null,
      oneachload: null,
      getTotal: function(){return total;},
      getCurrent: function(){return current;}
    },
    load: function(array){
      total += array.length;
      for (var i = 0, max_i = array.length; i < max_i; i++) {
        this.map[array[i]] = new Texture(array[i]);
      }
    },
    initialize: function(_parent){
      parent = _parent || '';
    },
    get: function(name){
      return this.map[name].get();
    }
  };

  function Texture(path){
    this.ready = false;
    this.name = path;

    this.texture = GL.gl.createTexture();
    this.image = new Image();
    this.image.onload = this.onLoad.bind(this);
    this.image.src = parent + '/' + path;
  }
  Texture.prototype.onLoad = function() {
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, this.texture);
    GL.gl.pixelStorei(GL.gl.UNPACK_FLIP_Y_WEBGL, true);
    GL.gl.texImage2D(GL.gl.TEXTURE_2D, 0, GL.gl.RGBA, GL.gl.RGBA, GL.gl.UNSIGNED_BYTE, this.image);
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, GL.gl.NEAREST);
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, GL.gl.NEAREST);
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, null);

    loaded(this);
  };
  Texture.prototype.get = function() {
    return this.texture;
  };

  return {
    init: function(_GL){GL = _GL;},
    textures: textures
  };
});