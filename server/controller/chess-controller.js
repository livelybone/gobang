/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../utils/get-data'), winDictionary = require('../utils/win-dictionary');

exports.method = 'POST';
exports.route = '/chess';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
      console.log(data);
      var finger = data.data.finger, chessboard = data.data.chessboard, pos = data.data.pos;

      console.log(chessboard);
      console.log(typeof chessboard);

      if (players.length < 2) return;

      var me = players.find(function (player) {
          return player.finger === finger
        }),
        opponent = players.find(function (player) {
          return player.finger === me.opponent.finger
        });

      // 刚开始，白方需要等黑方落子，因此需要建立长轮询，添加chessHandler
      if (!pos) {
        me.chessHandler = {res: res};
        return
      }

      var win = judge(chessboard, pos, me.role);

      // 给对手发送棋子位置，并清除对手的chessHandler，如果没结束，保存棋盘

      var res1 = opponent.chessHandler && opponent.chessHandler.res;
      res1.end(JSON.stringify({pos: pos, gameOver: win, winner: win ? {finger: finger, role: me.role} : ''}));
      opponent.chessHandler = null;
      if (!win) opponent.chessboard = chessboard;

      // 如果自己赢了，返回结果，否则不返回，给自己添加chessHandler，并保存棋盘
      if (win) {
        res.end({gameOver: win, winner: win ? {finger: finger, role: me.role} : ''});
        me.chessHandler = null;
      } else {
        me.chessHandler = {res: res};
        me.chessboard = chessboard;
      }
    }
  )
};

function judge(chessboard, pos, myRole) {
  var rolePieces = [];
  chessboard.map(function (x, abscissa) {
    x.map(function (y, ordinate) {
      // 0表示未被占位
      if (y === myRole) {
        rolePieces.push({abscissa: abscissa, ordinate: ordinate});
      }
    })
  });

  if (rolePieces.length < 5) {
    // 棋子少于5，不判断
    return false;
  }

  // 去赢法字典里面寻找，如果没找到，则继续；如果找到了，则游戏结束，当前玩家获胜。这算法应该还能优化...
  var isGameOver = winDictionary
    .filter(function (group) {
      return group.find(function (piece) {
        return piece.abscissa === pos.abscissa && piece.ordinate === pos.ordinate;
      })
    })
    .find(function (group) {
      var index = 0;
      group.map(function (piece) {
        var exist = rolePieces.find(function (p) {
          return piece.abscissa === p.abscissa && piece.ordinate === p.ordinate;
        });
        if (exist) index += 1;
      });
      return index === 5;
    });

  return !!isGameOver;
}