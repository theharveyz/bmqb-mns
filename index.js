var fs = require('fs');

try{
  fs.accessSync(__dirname + '/lib/index.js', fs.R_OK);

  exports = module.exports = require('./lib');
} catch (e) {
  exports = module.exports = require('./src');
}

try {
  // 兼容新的接口
  if (!global._babelPolyfill) {
    require('babel-polyfill');
  }
} catch (e) {
  // ...
}
