/**
 * Created by Livelybone on 2017-12-17.
 */

define(function () {
  function MyPromise(fn) {
    this.status = 'pending';
    this.successFn = null;
    this.failedFn = null;
    var that = this;

    function flat(result, res) {
      if (result instanceof MyPromise) {
        result.then(function (val) {
          flat(val, res);
        })
      } else {
        res(result)
      }
    }

    function deal(fn, res, rej) {
      if (fn) {
        try {
          flat(fn(), res);
        } catch (e) {
          rej(e)
        }
      } else {
        res();
      }
    }

    this.then = function (successFn, failedFn) {
      return new MyPromise(function (res, rej) {
        if (that.status === 'resolve') {
          deal(successFn, res, rej);
        } else if (that.status === 'reject') {
          deal(failedFn, res, rej);
        } else {
          that.successFn = function () {
            deal(successFn, res, rej);
          };
          that.failedFn = function () {
            deal(failedFn, res, rej);
          };
        }
      });
    };

    this.resolve = function (val) {
      that.status = 'resolve';
      if (that.successFn) that.successFn(val);
    };

    this.reject = function (val) {
      that.status = 'reject';
      if (that.failedFn) that.failedFn(val);
    };

    fn(that.resolve, that.reject);
  }

  return {MyPromise: MyPromise};
});