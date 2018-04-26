/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const winDictionary = require('./utils/win-dictionary');

class Chessboard {
  constructor() {
    this.step = 0;
    this.nextRole = 'black';
    this.chessboard = [...new Array(15)].map(val => [...new Array(15)].map(val => 0))
  }

  chess(pos, role) {
    console.log(role);
    if (this.nextRole !== role) throw new Error('还没轮到你下棋！');
    this.chessboard[pos.abscissa][pos.ordinate] = role + (++this.step);
    this.nextRole = role === 'white' ? 'black' : 'white';
  }

  judge(pos, myRole) {
    if (this.chessboard.reduce((pre, row) => pre + row.reduce((pre, val) => pre + (val ? 1 : 0), 0), 0).length < 5) {
      // 棋子少于5，不判断
      return false;
    }

    // 去赢法字典里面寻找，如果没找到，则继续；如果找到了，则游戏结束，当前玩家获胜。这算法应该还能优化...
    const isGameOver = winDictionary
      .filter(group => group.find(piece => piece.abscissa === pos.abscissa && piece.ordinate === pos.ordinate))
      .find(group => {
        let count = 0;
        group.map(piece => {
          const isMe = this.chessboard[piece.abscissa][piece.ordinate] && this.chessboard[piece.abscissa][piece.ordinate].includes(myRole);
          if (isMe) count += 1;
        });
        return count === 5;
      });

    return !!isGameOver;
  }

  withdraw(step = 1) {
    for (let i = step; i > 0; i--) {
      this.chessboard.some((abs, i) => {
        const ord = abs.some((ord, j) => {
          if (ord && ord.includes(this.step)) {
            this.chessboard[i][j] = 0;
            --this.step;
            return true;
          }
        });
        if (ord) {
          return true;
        }
      })
    }
  }
}

module.exports = Chessboard;