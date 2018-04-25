var URL = require('url'), querystring = require('querystring');
module.exports = function getData(req, callback) {
  var urlData = Object.assign({}, URL.parse(req.url, true).query);
  var postData = {}, data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    postData = Object.assign({}, querystring.parse(data));

    urlData = dataDeal(urlData);
    postData = dataDeal(postData);

    if (callback) callback({
      data: Object.assign({}, urlData, postData),
      getData: urlData,
      postData: postData
    });
  });
};

function dataDeal(data) {

  var reg = /(^{.*}$)|(^\[.*]$)|(^true$)|(^false$)/;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      try {
        if (reg.test(data[key]))
          data[key] = JSON.parse(data[key]);
      } catch (e) {
        data[key] = data[key];
      }
    }
  }

  return data;
}