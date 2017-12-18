/**
 * Created by Livelybone on 2017-12-17.
 */
define(function () {
  function Role() {
    this.black = 'black';
    this.white = 'white';
    this.currentPlayer = this.black;

    this.init = function () {
      this.currentPlayer = this.black;
    }
  }

  return new Role();
});