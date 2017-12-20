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

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }

  return {getOffset: getOffset, getScroll: getScroll, backUrl: 'http://192.168.3.71'};
});