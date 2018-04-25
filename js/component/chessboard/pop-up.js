/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/chessboard/chessboard'], function (chessboard) {
  function Popup() {
    this.init = function () {
      var floatWin = $('#game-tip');
      if (!floatWin.length) {
        floatWin = $('<p id="game-tip"></p>');
        floatWin.css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          zIndex: '100',
          width: '0',
          height: '140px',
          margin: '-70px 0 0 -150px',
          lineHeight: '36px',
          borderRadius: '10px',
          fontSize: '30px',
          color: '#666',
          textAlign: 'center',
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,.15)',
          transition: 'width .3s ease-out'
        });
        chessboard.board.appendChild(floatWin[0]);
      }
    };

    this.animation = function (text, holdTime, callback) {
      var floatWin = $('#game-tip');
      floatWin.css({width: '300px'});

      // callback hell, 还比较小应该没什么关系，后期可以改动
      setTimeout(function () {
        floatWin.html(text);
        setTimeout(function () {
          floatWin.css({width: '0'});
          floatWin.html('');
          setTimeout(function () {
            try {
              if (callback) callback();
            } catch (e) {
              console.error(e);
            }
          }, 300);
        }, holdTime || 2000);
      }, 300);
    };
  }

  return new Popup();
});