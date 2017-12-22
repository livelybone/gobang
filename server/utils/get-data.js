var URL = require('url'), querystring = require('querystring');
module.exports = function getData(req, callback) {
  var urlData = URL.parse(req.url, true).query;
  var postData = {}, data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    postData = querystring.parse(data);
    if (callback) callback({data: Object.assign({}, urlData, postData), getData: urlData, postData: postData});
  });
};
