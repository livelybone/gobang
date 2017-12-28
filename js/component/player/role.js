/**
 * Created by Livelybone on 2017-12-17.
 */
define(function () {
  function Role() {
    this.black = 'black';
    this.white = 'white';
    this.currentRole = this.black;

    this.init = function () {
      this.currentRole = this.black;

    }
  }

  return new Role();
});