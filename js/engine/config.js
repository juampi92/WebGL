var require = {
  baseUrl: 'js',
  paths: {
    lib: 'lib',
    engine: 'engine',
    home: '../../',

    glMatrix:'lib/gl-matrix-min',
    GL: 'engine/main',

    text: 'lib/text'
  },
};

function GL_loader(deps,callback){
  var _deps = ['GL'],
    i;

  for (i = 0, max_i = deps.app.length; i < max_i; i++)
    _deps.push(deps.app[i]);

  for (i = 0, max_i = deps.modules.length; i < max_i; i++)
    _deps.push('engine/modules/' + deps.modules[i]);

  for (i = 0, max_i = deps.shaders.length; i < max_i; i++)
    _deps.push('text!engine/shaders/' + deps.shaders[i] + '.shdr');

  requirejs(_deps,callback);
}