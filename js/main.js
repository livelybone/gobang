// 项目也没有特别复杂，就没有使用 jQuery, react, angular2, vue 框架了，使用了 requireJS 将 js 模块化

require.config({
  baseUrl: './js'
});

require(['action/chess'], function (Chess) {
  window['chessboard'] = new Chess();
  chessboard.init();
  ele('black').addEventListener('click', begin.bind(null, 'black'));
  ele('white').addEventListener('click', begin.bind(null, 'white'));
  ele('restart').addEventListener('click', restart.bind(null));
});

requirejs.onError = err;

function begin(role) {
  var roles = [
    {name: 'You', isComputer: false},l
    {name: 'Computer', isComputer: true}
  ];
  var roleBlack = role === 'black' ? roles[0] : roles[1], roleWhite = role === 'white' ? roles[0] : roles[1];
  chessboard.gameStart(roleBlack, roleWhite);
  hide(ele('black'));
  hide(ele('white'));
  hide(ele('tip'));
  show(ele('restart'));
}

function restart() {
  chessboard.restart();
  show(ele('black'));
  show(ele('white'));
  show(ele('tip'));
  hide(ele('restart'));
}

function ele(id) {
  return document.getElementById(id);
}

function hide(ele) {
  ele.style.display = 'none';
}

function show(ele) {
  ele.style.display = 'block';
}

function err(error) {
  console.error(error);
}