exports.resFormat = function (data = null, type = 'NORMAL', errorMsg = '') {
  return JSON.stringify({type, data, errorMsg});
};