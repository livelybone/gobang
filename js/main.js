// 项目也没有特别复杂，就没有使用jQuery,react,angular2,vue框架了，使用了requireJS将js模块化

require.config({
  baseUrl: './js',
  paths: {
    jquery: 'jquery.min'
  }
});

require(['jquery', 'action/chess', 'action/getPlayers'], function (jQuery, Chess, getPlayers) {
  console.log('jQuery version: ' + jQuery().jquery);
  window['chessboard'] = new Chess();
  chessboard.init();
  $('#black').bind('click', begin.bind(null, 'black'));
  $('#white').bind('click', begin.bind(null, 'white'));
  $('#restart').bind('click', restart.bind(null));

  getPlayers();
});

requirejs.onError = err;

function begin(role) {
  var roles = [
    {name: 'You', isComputer: false},
    {name: 'Computer', isComputer: true}
  ];
  var roleBlack = role === 'black' ? roles[0] : roles[1], roleWhite = role === 'white' ? roles[0] : roles[1];
  chessboard.gameStart(roleBlack, roleWhite);
  $('#black').hide();
  $('#white').hide();
  $('#tip').hide();
  $('#restart').show();
}

function restart() {
  chessboard.restart();
  $('#black').show();
  $('#white').show();
  $('#tip').show();
  $('#restart').hide();
}

function err(error) {
  console.error(error);
}