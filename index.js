/*
 * memoize.js
 * by @SunHuawei
 * Released under an MIT license.
 */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports)
    module.exports = definition()
  else
    context[name] = definition()
})('memoize', this, function () {
  function memoizeOriginal (fn) {
    var lastArgs = [];
    var lastResult = null;

    function mem () {
      var args = [].slice.call(arguments);

      if (_eq(args, lastArgs)) {
        return lastResult;
      }

      var result = fn.apply(undefined, args);
      lastArgs = args;
      lastResult = result;

      return result;
    }

    function report () {
      return {
        args: lastArgs,
        result: lastResult,
      };
    }

    function clear () {
      var stored = report();
      lastArgs = [];
      lastResult = null;
      return stored;
    };

    mem.clear = clear;
    mem.report = report;

    return mem;
  };

  function replace (fn, compare) {
    var cachedResult = null;
    compare = compare ? compare : function (prev, fresh) {
      return prev === fresh;
    };

    function mem () {
      var args = [].slice.call(arguments);
      var result = fn.apply(undefined, args);
      var isSame = compare(cachedResult, result);
      if (!isSame) {
        cachedResult = result;
      }
      return cachedResult;
    }

    function report () {
      return {
        result: cachedResult,
      };
    }

    function clear () {
      var stored = report();
      cachedResult = null;
      return stored;
    };

    mem.clear = clear;
    mem.report = report;

    return mem;
  }

  function _eq (args1, args2) {
    if (!args1 || !args2 || args1.length !== args2.length) return false;
    for (var i = 0; i < args1.length; i++) {
      if (args1[i] !== args2[i]) {
        return false;
      }
    }

    return true;
  }

  var memoize = memoizeOriginal;
  memoize.replace = replace;

  return memoize;
})
