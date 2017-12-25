/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/chessboard/chessboard'], function (chessboard) {
  function Popup() {
    this.init = function () {
      var floatWin = document.getElementById('game-tip');
      if (!floatWin) {
        floatWin = document.createElement('p');
        floatWin.id = 'game-tip';
        floatWin.style.display = 'flex';
        floatWin.style.alignItems = 'center';
        floatWin.style.justifyContent = 'center';
        floatWin.style.position = 'absolute';
        floatWin.style.left = '50%';
        floatWin.style.top = '50%';
        floatWin.style.zIndex = '100';
        floatWin.style.width = '0';
        floatWin.style.height = '140px';
        floatWin.style.margin = '-70px 0 0 -150px';
        floatWin.style.lineHeight = '36px';
        floatWin.style.borderRadius = '10px';
        floatWin.style.fontSize = '30px';
        floatWin.style.color = '#666';
        floatWin.style.textAlign = 'center';
        floatWin.style.background = '#fff';
        floatWin.style.boxShadow = '0 2px 10px rgba(0,0,0,.15)';
        floatWin.style.transition = 'width .3s ease-out';
        chessboard.board.appendChild(floatWin);
      }
    };

    this.animation = function (text, holdTime, callback) {
      var floatWin = document.getElementById('game-tip');
      floatWin.style.width = '300px';

      // callback hell, 还比较小应该没什么关系，后期可以改动
      setTimeout(function () {
        floatWin.innerHTML = text;
        setTimeout(function () {
          floatWin.style.width = '0';
          floatWin.innerHTML = '';
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