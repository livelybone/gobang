const client = new Function('require', '__dirname', render('./server.js')),
  server = new Function('require', '__dirname', render('./server/server.js'));

client(require, __dirname);
server(path => path.startsWith('.') ? require(require('path').join(__dirname, './server', path)) : require(path), __dirname);


function render (src) {
  return require('fs').readFileSync(require('path').join(__dirname, src));
}
