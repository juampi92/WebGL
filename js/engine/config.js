var require = {
  baseUrl: 'js',
  paths: {
    lib: 'lib',
    engine: 'engine',
    home: '../../',

    glMatrix:'lib/gl-matrix-min',
    GL: 'engine/main'
  },
};

function GL_loader(deps,callback){
  var _deps = ['GL'];

  for(var key in deps)
    for (var i = 0, max_i = deps[key].length; i < max_i; i++)
      _deps.push('engine/' + key + '/' + deps[key][i]);

  requirejs(_deps,callback);
}