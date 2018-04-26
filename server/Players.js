/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const Chessboard = require("./Chessboard");
const defaultName = require("./utils/Utils").defaultName;
const resFormat = require("./utils/ResponseFormat").resFormat;

class Player {
  constructor({name = '', finger, role = null, opponent = null, chessboard = null}) {
    this.name = name || defaultName(finger);
    this.finger = finger;
    this.role = role;
    this.opponent = opponent; // (对手信息：name、finger、role)
    this.chessboard = chessboard; // (棋盘，落子信息)
    this.listenPlayersHandler = null; // (用于监听其他玩家的进出，或者匹配)
    this.listenInviteResponseHandlers = []; // (用于监听我邀请的结果，可能有多个handler)
    this.listenInvitedHandler = []; // (用于监听其它玩家对我的邀请
    this.listenMatchHandler = null; // (用于监听我匹配的结果)
    this.listenChessHandler = null; // (用于监听对手下棋)
    this.listenGiveUpHandler = null; // (用于监听对手的投降请求)
    this.listenGiveUpResponseHandler = null; // (用于监听我的投降请求的结果)
    this.listenWithdrawHandler = null; // (用于监听对手的悔棋请求)
    this.listenWithdrawResponseHandler = null // (用于监听我的悔棋请求的结果)
  }
}

class Players {
  constructor() {
    this.players = [];
  }

  getPlayers(finger = '') {
    return this.players.map(player => ({
      name: player.name,
      finger: player.finger,
      role: player.role,
      chessboard: finger && finger === player.finger ? player.chessboard : null,
      isChess: !!player.role,
    }));
  }

  add({name = '', finger, role = null, opponent = null, chessboard = null}) {
    if (finger) {
      this.players.push(new Player({name, finger, role, opponent, chessboard}));
      this.players.forEach(player => {
        if (player.listenPlayersHandler) {
          player.listenPlayersHandler.res.end(resFormat({players: this.getPlayers()}, 'PLAYERS_ENTER'))
        }
      })
    }
  }

  del(finger) {
    const index = Object.keys(this.players).find(key => this.players[key].finger === finger);
    if (index !== undefined) {
      this.players.splice(index, 1);
      this.players.forEach(player => {
        if (player.listenPlayersHandler) {
          player.listenPlayersHandler.res.end(resFormat({players: this.getPlayers()}, 'PLAYERS_LEAVE'))
        }
      })
    }
  };

  setProps(finger, props = {}) {
    const index = Object.keys(this.players).find(key => this.players[key].finger === finger);
    this.players[index] = {...this.players[index], ...props}
  }

  initPlayer(finger) {
    const index = Object.keys(this.players).find(key => this.players[key].finger === finger);
    const player = this.players[index];
    for (let key in player) {
      if (player.hasOwnProperty(key) && player[key]) {
        if (key.endsWith('Handler')) {
          player[key].res.end(resFormat('', 'CLOSE'));
        } else if (key.endsWith('Handlers')) {
          player[key].map(handler => {
            handler.res.end(resFormat('', 'CLOSE'));
          })
        }
      }
    }
    this.players[index] = new Player({finger, name: player.name})
  }

  startChess(fingers = [], callback) {
    if (fingers.length !== 2) throw new Error(__filename + ': fingers 必须要为长度等于2的数组！');
    const players = fingers.map(finger => this.players.find(player => player.finger === finger));
    const random = Math.random();
    // 随机分配角色
    players[0].role = random < .5 ? 'black' : 'white';
    players[1].role = random >= .5 ? 'black' : 'white';

    // 设置 opponent
    players[0].opponent = players[1];
    players[1].opponent = players[0];

    // 初始化 chessboard
    players[0].chessboard = players[1].chessboard = new Chessboard();

    if (callback) callback();

    // 初始化一些监听函数
    players.forEach(player => {
      if (player.listenInviteResponseHandlers.length > 1) {  // 处理监听我的邀请结果的 handler
        player.listenInviteResponseHandlers.forEach(handler => {
          if (!handler.res.finished) {
            handler.res.end(resFormat('', 'CLOSE'))
          }
        });
        player.listenInviteResponseHandlers = [];
      }

      if (player.listenInvitedHandler) {  // 处理监听其它玩家对我的邀请的 handler
        player.listenInvitedHandler.res.end(resFormat('', 'CLOSE'));
        player.listenInvitedHandler = null;
      }

      if (player.listenMatchHandler) {  // 处理监听我的匹配结果的 handler
        player.listenMatchHandler.res.end(resFormat('', 'CLOSE'));
        player.listenMatchHandler = null;
      }
    })
  }

  chess({finger, pos, res}) {
    const me = this.players.find(player => player.finger === finger), opponent = me.opponent,
      chessboard = me.chessboard, role = me.role;
    if (chessboard.chessboard[pos.abscissa][pos.ordinate]) {
      throw new Error('该位置已经有棋子了！')
    }
    if (!opponent.listenChessHandler) {
      throw new Error('对手的 listenChessHandler 找不到！')
    }

    chessboard.chess(pos, role);

    // 判断是否结束
    const isGameOver = chessboard.judge(pos, role);

    if (isGameOver) {
      opponent.listenChessHandler.res.end(resFormat({pos, winner: {name: me.name, finger: me.finger}}, 'GAME_OVER'));
      res.end(resFormat({winner: {name: me.name, finger: me.finger}}, 'GAME_OVER'));
      this.gameOver(finger)
    } else {
      res.end(resFormat('', 'CHESS'));

      // 向对手发送落子信息
      opponent.listenChessHandler.res.end(resFormat({pos, opponent: {name: me.name, finger}}, 'CHESS'));
      opponent.listenChessHandler = null;
    }
  }

  gameOver(winFinger) {
    const player = this.players.find(player => player.finger === winFinger);
    const opponent = player.opponent;
    if (!opponent) throw new Error('opponent 未找到！');
    [player, opponent].forEach(p => {
      this.initPlayer(p.finger);
    })
  }
}

module.exports = new Players();