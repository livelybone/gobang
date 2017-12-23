/**
 * Created by Livelybone on 2017-12-17.
 */
define(function () {
  function createWinDictionary() {
    var winDictionary = [];
    for (var abscissa = 0; abscissa < 15; abscissa++) {
      for (var ordinate = 0; ordinate < 15; ordinate++) {
        if (abscissa < 11) {
          // 横排赢法
          var groupAbscissa = [
            {abscissa: abscissa, ordinate: ordinate},
            {abscissa: abscissa + 1, ordinate: ordinate},
            {abscissa: abscissa + 2, ordinate: ordinate},
            {abscissa: abscissa + 3, ordinate: ordinate},
            {abscissa: abscissa + 4, ordinate: ordinate}
          ];
          winDictionary.push(groupAbscissa);
        }

        if (ordinate < 11) {
          // 纵排赢法
          var groupOrdinate = [
            {abscissa: abscissa, ordinate: ordinate},
            {abscissa: abscissa, ordinate: ordinate + 1},
            {abscissa: abscissa, ordinate: ordinate + 2},
            {abscissa: abscissa, ordinate: ordinate + 3},
            {abscissa: abscissa, ordinate: ordinate + 4}
          ];
          winDictionary.push(groupOrdinate);

          if (abscissa >= 4) {
            // 左斜线赢法
            var groupDiagonalLeft = [
              {abscissa: abscissa, ordinate: ordinate},
              {abscissa: abscissa - 1, ordinate: ordinate + 1},
              {abscissa: abscissa - 2, ordinate: ordinate + 2},
              {abscissa: abscissa - 3, ordinate: ordinate + 3},
              {abscissa: abscissa - 4, ordinate: ordinate + 4}
            ];
            winDictionary.push(groupDiagonalLeft);
          }

          if (abscissa < 11) {
            // 右斜线赢法
            var groupDiagonalRight = [
              {abscissa: abscissa, ordinate: ordinate},
              {abscissa: abscissa + 1, ordinate: ordinate + 1},
              {abscissa: abscissa + 2, ordinate: ordinate + 2},
              {abscissa: abscissa + 3, ordinate: ordinate + 3},
              {abscissa: abscissa + 4, ordinate: ordinate + 4}
            ];
            winDictionary.push(groupDiagonalRight);
          }
        }
      }
    }
    return winDictionary;
  }

  return createWinDictionary() || [];
});