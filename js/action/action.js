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
    }, function (xhr, errorMsg, exception) {
      if (window.chessboard.isChess && xhr.readyState === 4) chess(chessboard, pos, role, successFn);
    })
  }

  function getChess(successFn) {
    api.get('/get/chess', {}, function (data, status, xhr) {
      if (data.type === 'TIMEOUT' && window.chessboard.isChess) {
        getChess(successFn);
      } else if (successFn) successFn(data, status, xhr)
    }, function (xhr, errorMsg, exception) {
      if (window.chessboard.isChess && xhr.readyState === 4) getChess(successFn);
    })
  }

  function listenWithdraw(successFn) {
    // 建立长轮询
    api.get('/listen/withdraw', {}, function (data, status, xhr) {
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
    api.post('/withdraw', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function withdrawResponse(accept, successFn) {
    "use strict";
    api.post('/withdraw/response', {accept: accept}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function giveUp(successFn) {
    api.post('/give-up', {}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function giveUpResponse(accept, successFn) {
    api.post('/give-up/response', {accept: accept}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function giveUpListen(successFn) {
    api.get('/give-up/listen', {}, function (data, status, xhr) {
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
    api.post('/invite', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function inviteAccept(opponentFinger, successFn) {
    api.post('/accept', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function inviteRefuse(opponentFinger, successFn) {
    api.post('/refuse', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (successFn) successFn(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function listenInvite(successFn) {
    // 建立长轮询
    api.get('/get/invite', {}, function (data, status, xhr) {
      try {
        if (data.type === 'TIMEOUT' && window.chessboard.isChess) {
          listenInvite(successFn);
        } else if (successFn) successFn(data, status, xhr);
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      if (window.chessboard.isChess && xhr.readyState === 4) listenInvite(successFn);
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