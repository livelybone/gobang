const http = require('http'), URL = require('url'), fs = require('fs'), path = require('path'),
  port = process.env.PORT || 3000;

http.createServer((req, res) => {
  const url = req.url;
  const srcObj = {src: '', type: ''};
  const regs = {
    js: {reg: /\.js$/, type: 'application/javascript'},
    css: {reg: /\.css$/, type: 'text/css; charset=utf-8'},
    media: {reg: /\.(jpg|jpeg|png)$/, type: ''},
    default: {reg: /.*/, src: './index.html', type: 'text/html; charset=utf-8'},
  };
  Object.keys(regs).some(key => {
    if (regs[key].reg.test(url)) {
      srcObj.src = regs[key].src || url;
      srcObj.type = regs[key].type;
      return true;
    }
  });
  const html = render(srcObj.src);
  res.writeHead(200, {'Content-Type': srcObj.type});
  res.end(html);
}).listen(port, res => {
  console.log('--------------Listening on port %d--------------', port);
}).on('error', e => {
  console.error(e);
});

function render (src) {
  return fs.readFileSync(path.join(__dirname, src));
}
