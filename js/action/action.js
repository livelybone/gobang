/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api', 'component/overlay'], function (api, overlay) {
  function getPlayers(successFn) {
    api.get('/enter', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function listenPlayer(successFn) {
    // 建立长轮询
    api.getLongPolling('/listen/players', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr);
      } catch (e) {
        console.error(e);
      }
    })
  }

  function chess(chessboard, pos, role, successFn) {
    api.post('/chess', {
      chessboard: chessboard ? JSON.stringify(chessboard) : chessboard,
      pos: pos ? JSON.stringify(pos) : pos,
      role: role
    }, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function getChess(successFn) {
    api.get('/chess/get', {}, function (data, status, xhr) {
      if (data.type === 'TIMEOUT' && window.chessboard.isChess) {
        getChess(successFn);
      } else if (successFn) successFn(data, status, xhr)
    }, function (xhr, errorMsg, exception) {
      if (window.chessboard.isChess && xhr.readyState === 4) getChess(successFn);
    })
  }

  function listenWithdraw(successFn) {
    // 建立长轮询
    api.get('/chess/withdraw/listen', {}, function (data, status, xhr) {
      try {
        if (data.type === 'TIMEOUT' && window.chessboard.isChess) {
          // 如果超时，则开再次请求
          listenWithdraw(successFn);
        } else if (successFn) successFn(data, status, xhr);
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      if (window.chessboard.isChess && xhr.readyState === 4) listenWithdraw(successFn);
    })
  }


  function withdraw(successFn) {
    api.post('/chess/withdraw', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function withdrawResponse(accept, successFn) {
    "use strict";
    api.post('/chess/withdraw/response', {accept: accept}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function giveUp(successFn) {
    api.post('/chess/give-up', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function giveUpResponse(accept, successFn) {
    api.post('/chess/give-up/response', {accept: accept}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function giveUpListen(successFn) {
    api.get('/chess/give-up/listen', {}, function (data, status, xhr) {
      try {
        if (data.type === 'TIMEOUT' && window.chessboard.isChess) {
          // 如果超时，则开再次请求
          giveUpListen(successFn);
        } else if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      if (window.chessboard.isChess && xhr.readyState === 4) giveUpListen(successFn);
    })
  }

  function invite(opponentFinger, successFn) {
    api.post('/match/invite', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function inviteAccept(opponentFinger, successFn) {
    api.post('/match/invite/accept', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function inviteRefuse(opponentFinger, successFn) {
    api.post('/match/invite/refuse', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function listenInvite(successFn) {
    // 建立长轮询
    api.get('/match/invite/get', {}, function (data, status, xhr) {
      try {
        if (data.type === 'TIMEOUT' && !window.chessboard.isChess) {
          listenInvite(successFn);
        } else if (successFn) successFn(data, status, xhr);
      } catch (e) {
        console.error(e);
      }
    })
  }

  function match(successFn) {
    api.post('/match', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return {
    getPlayers: getPlayers,
    invite: invite,
    chess: chess,
    getChess: getChess,
    listenPlayer: listenPlayer,
    listenInvite: listenInvite,
    inviteRefuse: inviteRefuse,
    inviteAccept: inviteAccept,
    match: match,
    giveUp: giveUp,
    giveUpListen: giveUpListen,
    giveUpResponse: giveUpResponse,
    listenWithdraw: listenWithdraw,
    withdraw: withdraw,
    withdrawAccept: withdrawResponse,
  }
});