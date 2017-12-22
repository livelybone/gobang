var URL = require('url');
module.exports = function getData(req, callback) {
  var urlData = URL.parse(req.url, true).query;
  var postData = {}, data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function (e) {
    console.log(e);
    console.log(data);
    if (callback) callback({data: Object.assign({}, urlData, postData), getData: urlData, postData: postData});
  });

  return pos;
};