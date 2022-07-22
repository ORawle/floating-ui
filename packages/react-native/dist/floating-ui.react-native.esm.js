import { useRef, useState, useMemo, useLayoutEffect, useCallback } from 'react';
import { computePosition, arrow as arrow$1 } from '@floating-ui/core';
export { autoPlacement, detectOverflow, flip, hide, inline, limitShift, offset, shift, size } from '@floating-ui/core';
import { Dimensions } from 'react-native';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var ORIGIN$1 = {
  x: 0,
  y: 0
};
var createPlatform = function createPlatform(_ref) {
  var offsetParent = _ref.offsetParent,
      _ref$sameScrollView = _ref.sameScrollView,
      sameScrollView = _ref$sameScrollView === void 0 ? true : _ref$sameScrollView,
      _ref$scrollOffsets = _ref.scrollOffsets,
      scrollOffsets = _ref$scrollOffsets === void 0 ? ORIGIN$1 : _ref$scrollOffsets;
  return {
    getElementRects: function getElementRects(_ref2) {
      var reference = _ref2.reference,
          floating = _ref2.floating;
      return new Promise(function (resolve) {
        var onMeasure = function onMeasure(offsetX, offsetY) {
          if (offsetX === void 0) {
            offsetX = 0;
          }

          if (offsetY === void 0) {
            offsetY = 0;
          }

          floating.measure(function (x, y, width, height) {
            var floatingRect = _extends({
              width: width,
              height: height
            }, ORIGIN$1);

            var method = sameScrollView ? 'measure' : 'measureInWindow';
            reference[method](function (x, y, width, height) {
              var referenceRect = {
                width: width,
                height: height,
                x: x - offsetX,
                y: y - offsetY
              };
              resolve({
                reference: referenceRect,
                floating: floatingRect
              });
            });
          });
        };

        if (offsetParent.current) {
          offsetParent.current.measure(onMeasure);
        } else {
          onMeasure();
        }
      });
    },
    getClippingRect: function getClippingRect() {
      var _Dimensions$get = Dimensions.get('window'),
          width = _Dimensions$get.width,
          height = _Dimensions$get.height;

      return Promise.resolve(_extends({
        width: width,
        height: height
      }, sameScrollView ? scrollOffsets : ORIGIN$1));
    },
    convertOffsetParentRelativeRectToViewportRelativeRect: function convertOffsetParentRelativeRectToViewportRelativeRect(_ref3) {
      var rect = _ref3.rect;
      return new Promise(function (resolve) {
        var onMeasure = function onMeasure(offsetX, offsetY) {
          if (offsetX === void 0) {
            offsetX = 0;
          }

          if (offsetY === void 0) {
            offsetY = 0;
          }

          resolve(_extends({}, rect, {
            x: rect.x + offsetX,
            y: rect.y + offsetY
          }));
        };

        if (offsetParent.current) {
          offsetParent.current.measure(onMeasure);
        } else {
          onMeasure();
        }
      });
    },
    getDimensions: function getDimensions(element) {
      return new Promise(function (resolve) {
        return element.measure(function (x, y, width, height) {
          return resolve({
            width: width,
            height: height
          });
        });
      });
    }
  };
};

// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'function' && a.toString() === b.toString()) {
    return true;
  }

  var length, i, keys;

  if (a && b && typeof a == 'object') {
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    keys = Object.keys(a);
    length = keys.length;

    if (length !== Object.keys(b).length) {
      return false;
    }

    for (i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (key === '_owner' && a.$$typeof) {
        continue;
      }

      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
}

var ORIGIN = {
  x: 0,
  y: 0
};
var useFloating = function useFloating(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? 'bottom' : _ref$placement,
      middleware = _ref.middleware,
      _ref$sameScrollView = _ref.sameScrollView,
      sameScrollView = _ref$sameScrollView === void 0 ? true : _ref$sameScrollView;

  var reference = useRef();
  var floating = useRef();
  var offsetParent = useRef();

  var _useState = useState({
    x: null,
    y: null,
    placement: placement,
    strategy: 'absolute',
    middlewareData: {}
  }),
      data = _useState[0],
      setData = _useState[1];

  var _useState2 = useState(ORIGIN),
      scrollOffsets = _useState2[0],
      setScrollOffsets = _useState2[1];

  var platform = useMemo(function () {
    return createPlatform({
      offsetParent: offsetParent,
      scrollOffsets: scrollOffsets,
      sameScrollView: sameScrollView
    });
  }, [offsetParent, scrollOffsets, sameScrollView]);

  var _useState3 = useState(middleware),
      latestMiddleware = _useState3[0],
      setLatestMiddleware = _useState3[1];

  if (!deepEqual(latestMiddleware == null ? void 0 : latestMiddleware.map(function (_ref2) {
    var name = _ref2.name,
        options = _ref2.options;
    return {
      name: name,
      options: options
    };
  }), middleware == null ? void 0 : middleware.map(function (_ref3) {
    var name = _ref3.name,
        options = _ref3.options;
    return {
      name: name,
      options: options
    };
  }))) {
    setLatestMiddleware(middleware);
  }

  var animationFrames = useRef([]);
  var isMountedRef = useRef(true);
  useLayoutEffect(function () {
    isMountedRef.current = true;
    return function () {
      isMountedRef.current = false;
    };
  }, []);
  var update = useCallback(function () {
    if (!reference.current || !floating.current) {
      return;
    }

    computePosition(reference.current, floating.current, {
      middleware: latestMiddleware,
      platform: platform,
      placement: placement
    }).then(function (data) {
      if (isMountedRef.current) {
        setData(data);
      }
    });
  }, [latestMiddleware, platform, placement]);
  useLayoutEffect(function () {
    var frames = animationFrames.current;
    frames.push(requestAnimationFrame(update));
    return function () {
      frames.forEach(cancelAnimationFrame);
      animationFrames.current = [];
    };
  }, [update]);
  var setReference = useCallback(function (node) {
    reference.current = node;
    animationFrames.current.push(requestAnimationFrame(update));
  }, [update]);
  var setFloating = useCallback(function (node) {
    floating.current = node;
    animationFrames.current.push(requestAnimationFrame(update));
  }, [update]);
  var setOffsetParent = useCallback(function (node) {
    offsetParent.current = node;
    animationFrames.current.push(requestAnimationFrame(update));
  }, [update]);
  var refs = useMemo(function () {
    return {
      reference: reference,
      floating: floating,
      offsetParent: offsetParent
    };
  }, []);
  return useMemo(function () {
    return _extends({}, data, {
      update: update,
      refs: refs,
      offsetParent: setOffsetParent,
      reference: setReference,
      floating: setFloating,
      scrollProps: {
        onScroll: function onScroll(event) {
          return setScrollOffsets(event.nativeEvent.contentOffset);
        },
        scrollEventThrottle: 16
      }
    });
  }, [data, refs, setReference, setFloating, setOffsetParent, update]);
};
var arrow = function arrow(options) {
  var element = options.element,
      padding = options.padding;

  function isRef(value) {
    return Object.prototype.hasOwnProperty.call(value, 'current');
  }

  return {
    name: 'arrow',
    options: options,
    fn: function fn(args) {
      if (isRef(element)) {
        if (element.current != null) {
          return arrow$1({
            element: element.current,
            padding: padding
          }).fn(args);
        }

        return {};
      } else if (element) {
        return arrow$1({
          element: element,
          padding: padding
        }).fn(args);
      }

      return {};
    }
  };
};

export { arrow, useFloating };
