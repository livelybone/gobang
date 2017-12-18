/**
 * Created by Livelybone on 2017-12-17.
 */

define(function () {
  function getOffset(ele) {
    var offsetParent = ele.offsetParent, offsetLeft = ele.offsetLeft, offsetTop = ele.offsetTop;
    while (offsetParent) {
      offsetLeft += offsetParent.offsetLeft;
      offsetTop += offsetParent.offsetTop;
      offsetParent = offsetParent.offsetParent;
    }
    return {offsetLeft: offsetLeft, offsetTop: offsetTop};
  }

  function getScroll() {
    if (typeof window.pageXOffset !== 'undefined') {
      return {
        scrollLeft: window.pageXOffset,
        scrollTop: window.pageYOffset
      }
    } else if (typeof document.documentElement.scrollLeft !== 'undefined') {
      return {
        scrollLeft: document.documentElement.scrollLeft,
        scrollTop: document.documentElement.scrollTop
      }
    }
  }

  return {getOffset: getOffset, getScroll: getScroll};
});