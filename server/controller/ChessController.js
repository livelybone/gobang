const resFormat = require("../utils/ResponseFormat").resFormat;
const Players = require('../Players');
const Utils = require("../utils/Utils");
const RouteManager = require('../utils/RouteManager');
const errorFn = require("../utils/Utils").errorFn;

class ChessController {
  constructor() {
    RouteManager.addRoute('POST', '/match/invite', this.invite);
    RouteManager.addRoute('GET', '/match/invite/get', this.listenInvite);
    RouteManager.addRoute('POST', '/match/invite/accept', this.inviteAccept);
    RouteManager.addRoute('POST', '/match/invite/refuse', this.inviteRefuse);
    RouteManager.addRoute('POST', '/match', this.match);
    RouteManager.addRoute('POST', '/chess', this.chess);
    RouteManager.addRoute('GET', '/chess/get', this.getChess);
    RouteManager.addRoute('POST', '/chess/give-up', this.giveUp);
    RouteManager.addRoute('POST', '/chess/give-up/response', this.giveUpResponse);
    RouteManager.addRoute('GET', '/chess/give-up/listen', this.listenGiveUp);
    RouteManager.addRoute('POST', '/chess/withdraw', this.withdraw);
    RouteManager.addRoute('POST', '/chess/withdraw/response', this.withdrawResponse);
    RouteManager.addRoute('GET', '/chess/withdraw/listen', this.listenWithdraw);
  }

  invite(req, res) {
    Utils.getData(req, data => {
      const finger = data.data.finger, opponentFinger = data.data.opponentFinger;

      if (Players.players.length < 2) throw new Error('该用户不存在');

      const [me, opponent] = [finger, opponentFinger].map(finger => Players.players.find(player => player.finger === finger));

      if (opponent.role) {
        return res.end(resFormat({
          opponent: {
            name: opponent.name,
            finger: opponent.finger
          }
        }, 'MATCH_FAILED', '玩家已开始游戏！'));
      }

      // 给opponent发送邀请
      opponent.listenInvitedHandler.res.end(resFormat({opponent: {name: me.name, finger}}, 'INVITE'));
      opponent.listenInvitedHandler = null;

      // 更新自己的inviteHandlers
      me.listenInviteResponseHandlers.push({opponentFinger, res});
    }, e => errorFn(res, e))
  }

  listenInvite(req, res) {
    Utils.getFinger(req, finger => {
      // 给自己添加listenInvitedHandler
      const me = Players.players.find(player => player.finger === finger);
      me.listenInvitedHandler = {res};
    }, e => errorFn(res, e))
  }

  inviteAccept(req, res) {
    Utils.getData(req, data => {
      const finger = data.data.finger, opponentFinger = data.data.opponentFinger;

      const me = Players.players.find(player => player.finger === finger),
        opponent = Players.players.find(player => player.finger === opponentFinger);

      if (!me || !opponent) throw new Error('玩家不存在！');

      if (opponent.opponent) {
        // 如果对方已匹配
        res.end(resFormat({opponent: {name: opponent.name, finger: opponent.finger}}, 'MATCH_FAILED', '已经开始游戏'))
      } else {
        Players.startChess([me.finger, opponent.finger], () => {
          [me, opponent].forEach((player, i) => {
            const responseText = resFormat({
              opponent: {name: player.opponent.name, finger: player.opponent.finger, role: player.opponent.role},
              role: player.role
            }, 'MATCH_SUCCESS');
            if (i === 1) {
              const handler = player.listenInviteResponseHandlers.find(handler => handler.opponentFinger === me.finger);
              handler.res.end(responseText);
            } else {
              res.end(responseText);
            }
          });
        })
      }
    }, e => errorFn(res, e))
  }

  inviteRefuse(req, res) {
    Utils.getData(req, data => {
      const finger = data.data.finger, opponentFinger = data.data.opponentFinger;

      const me = Players.players.find(player => player.finger === finger),
        opponent = Players.players.find(player => player.finger === opponentFinger);

      if (!me || !opponent) throw new Error('玩家不存在！');

      // 更新对方的 listenInviteResponseHandlers
      const index = Object.keys(opponent.listenInviteResponseHandlers).find(key => opponent.listenInviteResponseHandlers[key].opponentFinger === finger);
      opponent.listenInviteResponseHandlers[index].res.end(
        resFormat({player: {name: me.name, finger: me.finger}}, 'MATCH_REFUSED')
      );

      res.end(resFormat('', 'MATCH_REFUSED'));
    }, e => errorFn(res, e))
  }

  match(req, res) {
    Utils.getFinger(req, finger => {
      if (Players.players.length < 2) throw new Error('玩家数量不足！');
      const me = Players.players.find(player => player.finger === finger),
        matches = Players.players.filter(player => player.listenMatchHandler && player.listenMatchHandler.res);

      if (!me) throw new Error('玩家不存在！');

      me.listenMatchHandler = {res};
      // 如果有正在匹配的玩家，则匹配成功，否则给自己添加matchHandler，等待其他玩家加入
      if (matches.length > 0) {
        Players.startChess([me.finger, matches[0].finger], () => {
          [me, matches[0]].forEach(player => {
            player.listenMatchHandler.res.end(resFormat({
              opponent: {name: player.opponent.name, finger: player.opponent.finger, role: player.opponent.role},
              role: player.role
            }, 'MATCH_SUCCESS'));
            player.listenMatchHandler = null;
          });
        });
      }
    }, e => errorFn(res, e))
  }

  chess(req, res) {
    Utils.getData(req, data => {
      const finger = data.data.finger, pos = data.data.pos;

      Players.chess({finger, pos, res});
    }, e => errorFn(res, e))
  }

  getChess(req, res) {
    Utils.getFinger(req, finger => {
      const me = Players.players.find(player => player.finger === finger);
      me.listenChessHandler = {res};
    }, e => errorFn(res, e))
  }

  giveUp(req, res) {
    Utils.getFinger(req, finger => {
      const me = Players.players.find(player => player.finger === finger),
        opponent = me.opponent;

      if (!me || !opponent) throw new Error('不在对弈中');

      // 给对方发送请求
      opponent.listenGiveUpHandler.res.end(resFormat(
        {opponent: {finger: me.finger, role: me.role}},
        'GIVE_UP'
      ));
      opponent.listenGiveUpHandler = null;

      // 更新自己的 listenGiveUpResponseHandler
      me.listenGiveUpResponseHandler = {res: res};
    }, e => errorFn(res, e))
  }

  giveUpResponse(req, res) {
    Utils.getData(req, data => {
      const finger = data.data.finger, accept = data.data.accept;

      const me = Players.players.find(player => player.finger === finger),
        opponent = me.opponent;

      if (!me || !opponent) throw new Error('不在对弈中');

      const res1 = opponent.listenGiveUpResponseHandler.res;
      if (accept) {
        // 接受，我赢了
        const responseText = resFormat(
          {winner: {name: me.name, finger: me.finger, role: me.role}, type: 'GIVE_UP'}, 'GAME_OVER');
        res1.end(responseText);
        res.end(responseText);
        Players.gameOver(finger);
      } else {
        // 拒绝，继续游戏
        const responseText = resFormat({player: {name: me.name, finger: me.finger, role: me.role}}, 'GAME_CONTINUE');
        res1.end(responseText);
        res.end(responseText);
      }

      // 初始化 opponent.listenGiveUpResponseHandler
      opponent.listenGiveUpResponseHandler = null;
    }, e => errorFn(res, e))
  }

  listenGiveUp(req, res) {
    Utils.getFinger(req, finger => {
      // 给自己添加listenGiveUpHandler
      const player = Players.players.find(player => player.finger === finger);
      player.listenGiveUpHandler = {res: res};
    }, e => errorFn(res, e))
  }

  withdraw(req, res) {
    Utils.getFinger(req, finger => {
      const me = Players.players.find(player => player.finger === finger),
        opponent = me.opponent;

      if (!me || !opponent) throw new Error('不在对弈中');

      // 给对方发送请求
      opponent.listenWithdrawHandler.res.end(resFormat({opponent: {finger: me.finger, role: me.role}}, 'WITHDRAW'));
      opponent.listenWithdrawHandler = null;

      me.listenWithdrawResponseHandler = {res: res};
    }, e => errorFn(res, e))
  }

  withdrawResponse(req, res) {
    Utils.getData(req, function (data) {
      const finger = data.data.finger, accept = data.data.accept;

      const me = Players.players.find(player => player.finger === finger),
        opponent = me.opponent, chessboard = me.chessboard;

      if (!me || !opponent) throw new Error('不在对弈中');

      const res1 = opponent.listenWithdrawResponseHandler.res;
      if (accept) {
        // 接受，如果由我当前执子，则后退1步，否则后退2步
        chessboard.withdraw(chessboard.nextRole === me.role ? 1 : 2);
        const responseText = resFormat(
          {accepted: true, player: {finger: opponent.finger, role: opponent.role}}, 'WITHDRAW'
        );
        res1.end(responseText);
        res.end(responseText);

        // 如果由我当前执子，需要结束对方的 listenChessHandler 监听
        if (opponent.listenChessHandler) {
          opponent.listenChessHandler.res.end('', "CLOSE");
          opponent.listenChessHandler.res = null;
        }
      } else {
        // 拒绝，继续游戏
        const responseText = resFormat({accepted: false}, 'WITHDRAW');
        res1.end(responseText);
        res.end(responseText);
      }

      // 初始化 listenWithdrawResponseHandler
      opponent.listenWithdrawResponseHandler = null;
    }, e => errorFn(res, e))
  }

  listenWithdraw(req, res) {
    Utils.getFinger(req, function (finger) {
      // 刷新玩家的 listenWithdrawHandler
      const player = Players.players.find(player => player.finger === finger);
      player.listenWithdrawHandler = {res: res};
    }, e => errorFn(res, e));
  }
}

module.exports = ChessController;