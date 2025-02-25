(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@floating-ui/react-dom'), require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', '@floating-ui/react-dom', 'react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FloatingUIReactDOM = {}, global.FloatingUIReactDOM, global.React, global.ReactDOM));
})(this, (function (exports, reactDom, React, reactDom$1) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var React__namespace = /*#__PURE__*/_interopNamespace(React);

  var index = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  function createPubSub() {
    const map = new Map();
    return {
      emit(event, data) {
        var _map$get;

        (_map$get = map.get(event)) == null ? void 0 : _map$get.forEach(handler => handler(data));
      },

      on(event, listener) {
        map.set(event, [...(map.get(event) || []), listener]);
      },

      off(event, listener) {
        map.set(event, (map.get(event) || []).filter(l => l !== listener));
      }

    };
  }

  let serverHandoffComplete = false;
  let count = 0;

  const genId = () => "floating-ui-" + count++;

  function useFloatingId() {
    const [id, setId] = React__namespace.useState(() => serverHandoffComplete ? genId() : undefined);
    index(() => {
      if (id == null) {
        setId(genId());
      } // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);
    React__namespace.useEffect(() => {
      if (!serverHandoffComplete) {
        serverHandoffComplete = true;
      }
    }, []);
    return id;
  } // `toString()` prevents bundlers from trying to `import { useId } from 'react'`


  const useReactId = React__namespace[/*#__PURE__*/'useId'.toString()];
  /**
   * Uses React 18's built-in `useId()` when available, or falls back to a
   * slightly less performant (requiring a double render) implementation for
   * earlier React versions.
   * @see https://floating-ui.com/docs/useId
   */

  const useId = useReactId != null ? useReactId : useFloatingId;

  const FloatingNodeContext = /*#__PURE__*/React__namespace.createContext(null);
  const FloatingTreeContext = /*#__PURE__*/React__namespace.createContext(null);
  const useFloatingParentNodeId = () => {
    var _React$useContext$id, _React$useContext;

    return (_React$useContext$id = (_React$useContext = React__namespace.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) != null ? _React$useContext$id : null;
  };
  const useFloatingTree = () => React__namespace.useContext(FloatingTreeContext);
  /**
   * Registers a node into the floating tree, returning its id.
   */

  const useFloatingNodeId = () => {
    const id = useId();
    const tree = useFloatingTree();
    const parentId = useFloatingParentNodeId();
    index(() => {
      const node = {
        id,
        parentId
      };
      tree == null ? void 0 : tree.addNode(node);
      return () => {
        tree == null ? void 0 : tree.removeNode(node);
      };
    }, [tree, id, parentId]);
    return id;
  };
  /**
   * Provides parent node context for nested floating elements.
   * @see https://floating-ui.com/docs/FloatingTree
   */

  const FloatingNode = _ref => {
    let {
      children,
      id
    } = _ref;
    const parentId = useFloatingParentNodeId();
    return /*#__PURE__*/React__namespace.createElement(FloatingNodeContext.Provider, {
      value: React__namespace.useMemo(() => ({
        id,
        parentId
      }), [id, parentId])
    }, children);
  };
  /**
   * Provides context for nested floating elements when they are not children of
   * each other on the DOM (i.e. portalled to a common node, rather than their
   * respective parent).
   * @see https://floating-ui.com/docs/FloatingTree
   */

  const FloatingTree = _ref2 => {
    let {
      children
    } = _ref2;
    const nodesRef = React__namespace.useRef([]);
    const addNode = React__namespace.useCallback(node => {
      nodesRef.current = [...nodesRef.current, node];
    }, []);
    const removeNode = React__namespace.useCallback(node => {
      nodesRef.current = nodesRef.current.filter(n => n !== node);
    }, []);
    const events = React__namespace.useState(() => createPubSub())[0];
    return /*#__PURE__*/React__namespace.createElement(FloatingTreeContext.Provider, {
      value: React__namespace.useMemo(() => ({
        nodesRef,
        addNode,
        removeNode,
        events
      }), [nodesRef, addNode, removeNode, events])
    }, children);
  };

  function getDocument(floating) {
    var _floating$ownerDocume;

    return (_floating$ownerDocume = floating == null ? void 0 : floating.ownerDocument) != null ? _floating$ownerDocume : document;
  }

  function getWindow(value) {
    var _getDocument$defaultV;

    return (_getDocument$defaultV = getDocument(value).defaultView) != null ? _getDocument$defaultV : window;
  }

  function isElement(value) {
    return value ? value instanceof getWindow(value).Element : false;
  }
  function isHTMLElement(value) {
    return value ? value instanceof getWindow(value).HTMLElement : false;
  }

  function useFloating(_temp) {
    let {
      open = false,
      onOpenChange = () => {},
      whileElementsMounted,
      placement,
      middleware,
      strategy,
      nodeId
    } = _temp === void 0 ? {} : _temp;
    const tree = useFloatingTree();
    const domReferenceRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef({});
    const events = React__namespace.useState(() => createPubSub())[0];
    const floating = reactDom.useFloating({
      placement,
      middleware,
      strategy,
      whileElementsMounted
    });
    const refs = React__namespace.useMemo(() => ({ ...floating.refs,
      domReference: domReferenceRef
    }), [floating.refs]);
    const context = React__namespace.useMemo(() => ({ ...floating,
      refs,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange
    }), [floating, nodeId, events, open, onOpenChange, refs]);
    index(() => {
      const node = tree == null ? void 0 : tree.nodesRef.current.find(node => node.id === nodeId);

      if (node) {
        node.context = context;
      }
    });
    const {
      reference
    } = floating;
    const setReference = React__namespace.useCallback(node => {
      if (isElement(node) || node === null) {
        context.refs.domReference.current = node;
      }

      reference(node);
    }, [reference, context.refs]);
    return React__namespace.useMemo(() => ({ ...floating,
      context,
      refs,
      reference: setReference
    }), [floating, refs, context, setReference]);
  }

  function mergeProps(userProps, propsList, elementKey) {
    const map = new Map();
    return { ...(elementKey === 'floating' && {
        tabIndex: -1
      }),
      ...userProps,
      ...propsList.map(value => value ? value[elementKey] : null).concat(userProps).reduce((acc, props) => {
        if (!props) {
          return acc;
        }

        Object.entries(props).forEach(_ref => {
          let [key, value] = _ref;

          if (key.indexOf('on') === 0) {
            if (!map.has(key)) {
              map.set(key, []);
            }

            if (typeof value === 'function') {
              var _map$get;

              (_map$get = map.get(key)) == null ? void 0 : _map$get.push(value);
            }

            acc[key] = function () {
              var _map$get2;

              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.forEach(fn => fn(...args));
            };
          } else {
            acc[key] = value;
          }
        });
        return acc;
      }, {})
    };
  }

  const useInteractions = function (propsList) {
    if (propsList === void 0) {
      propsList = [];
    }

    return {
      getReferenceProps: userProps => mergeProps(userProps, propsList, 'reference'),
      getFloatingProps: userProps => mergeProps(userProps, propsList, 'floating'),
      getItemProps: userProps => mergeProps(userProps, propsList, 'item')
    };
  };

  function getChildren(nodes, id) {
    var _nodes$filter;

    let allChildren = (_nodes$filter = nodes.filter(node => {
      var _node$context;

      return node.parentId === id && ((_node$context = node.context) == null ? void 0 : _node$context.open);
    })) != null ? _nodes$filter : [];
    let currentChildren = allChildren;

    while (currentChildren.length) {
      var _nodes$filter2;

      currentChildren = (_nodes$filter2 = nodes.filter(node => {
        var _currentChildren;

        return (_currentChildren = currentChildren) == null ? void 0 : _currentChildren.some(n => {
          var _node$context2;

          return node.parentId === n.id && ((_node$context2 = node.context) == null ? void 0 : _node$context2.open);
        });
      })) != null ? _nodes$filter2 : [];
      allChildren = allChildren.concat(currentChildren);
    }

    return allChildren;
  }

  function isPointInPolygon(point, polygon) {
    const [x, y] = point;
    let isInside = false;
    const length = polygon.length;

    for (let i = 0, j = length - 1; i < length; j = i++) {
      const [xi, yi] = polygon[i] || [0, 0];
      const [xj, yj] = polygon[j] || [0, 0];
      const intersect = yi >= y !== yj >= y && x <= (xj - xi) * (y - yi) / (yj - yi) + xi;

      if (intersect) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  function safePolygon(_temp) {
    let {
      restMs = 0,
      buffer = 0.5,
      debug = null
    } = _temp === void 0 ? {} : _temp;
    let timeoutId;
    let polygonIsDestroyed = false;
    return _ref => {
      let {
        x,
        y,
        placement,
        refs,
        onClose,
        nodeId,
        tree,
        leave = false
      } = _ref;
      return function onPointerMove(event) {
        var _refs$domReference$cu, _refs$floating$curren;

        clearTimeout(timeoutId);

        function close() {
          clearTimeout(timeoutId);
          onClose();
        }

        if (event.pointerType && event.pointerType !== 'mouse') {
          return;
        }

        const {
          clientX,
          clientY
        } = event;
        const target = 'composedPath' in event ? event.composedPath()[0] : event.target;
        const targetNode = target; // If the pointer is over the reference or floating element already, there
        // is no need to run the logic.

        if (event.type === 'pointermove' && (_refs$domReference$cu = refs.domReference.current) != null && _refs$domReference$cu.contains(targetNode)) {
          return;
        } // If any nested child is open, abort.


        if (tree && getChildren(tree.nodesRef.current, nodeId).some(_ref2 => {
          let {
            context
          } = _ref2;
          return context == null ? void 0 : context.open;
        })) {
          return;
        } // The cursor landed, so we destroy the polygon logic


        if ((_refs$floating$curren = refs.floating.current) != null && _refs$floating$curren.contains(targetNode) && !leave) {
          polygonIsDestroyed = true;
          return;
        }

        if (!refs.domReference.current || !refs.floating.current || placement == null || x == null || y == null) {
          return;
        }

        const refRect = refs.domReference.current.getBoundingClientRect();
        const rect = refs.floating.current.getBoundingClientRect();
        const side = placement.split('-')[0];
        const cursorLeaveFromRight = x > rect.right - rect.width / 2;
        const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2; // If the pointer is leaving from the opposite side, the "buffer" logic
        // creates a point where the floating element remains open, but should be
        // ignored.
        // A constant of 1 handles floating point rounding errors.

        if (side === 'top' && y >= refRect.bottom - 1 || side === 'bottom' && y <= refRect.top + 1 || side === 'left' && x >= refRect.right - 1 || side === 'right' && x <= refRect.left + 1) {
          return close();
        } // Ignore when the cursor is within the rectangular trough between the
        // two elements. Since the triangle is created from the cursor point,
        // which can start beyond the ref element's edge, traversing back and
        // forth from the ref to the floating element can cause it to close. This
        // ensures it always remains open in that case.


        switch (side) {
          case 'top':
            if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= refRect.top + 1) {
              return;
            }

            break;

          case 'bottom':
            if (clientX >= rect.left && clientX <= rect.right && clientY >= refRect.bottom - 1 && clientY <= rect.bottom) {
              return;
            }

            break;

          case 'left':
            if (clientX >= rect.left && clientX <= refRect.left + 1 && clientY >= rect.top && clientY <= rect.bottom) {
              return;
            }

            break;

          case 'right':
            if (clientX >= refRect.right - 1 && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
              return;
            }

            break;
        }

        if (polygonIsDestroyed) {
          return close();
        }

        function getPolygon(_ref3) {
          let [x, y] = _ref3;
          const isFloatingWider = rect.width > refRect.width;
          const isFloatingTaller = rect.height > refRect.height;

          switch (side) {
            case 'top':
              {
                const cursorPointOne = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1];
                const cursorPointTwo = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1];
                const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.bottom - buffer : isFloatingWider ? rect.bottom - buffer : rect.top], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.bottom - buffer : rect.top : rect.bottom - buffer]];
                return [cursorPointOne, cursorPointTwo, ...commonPoints];
              }

            case 'bottom':
              {
                const cursorPointOne = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer];
                const cursorPointTwo = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer];
                const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.top + buffer : isFloatingWider ? rect.top + buffer : rect.bottom], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.top + buffer : rect.bottom : rect.top + buffer]];
                return [cursorPointOne, cursorPointTwo, ...commonPoints];
              }

            case 'left':
              {
                const cursorPointOne = [x + buffer + 1, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
                const cursorPointTwo = [x + buffer + 1, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
                const commonPoints = [[cursorLeaveFromBottom ? rect.right - buffer : isFloatingTaller ? rect.right - buffer : rect.left, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.right - buffer : rect.left : rect.right - buffer, rect.bottom]];
                return [...commonPoints, cursorPointOne, cursorPointTwo];
              }

            case 'right':
              {
                const cursorPointOne = [x - buffer, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
                const cursorPointTwo = [x - buffer, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
                const commonPoints = [[cursorLeaveFromBottom ? rect.left + buffer : isFloatingTaller ? rect.left + buffer : rect.right, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.left + buffer : rect.right : rect.left + buffer, rect.bottom]];
                return [cursorPointOne, cursorPointTwo, ...commonPoints];
              }
          }
        }

        const poly = getPolygon([x, y]);

        if (process.env.NODE_ENV !== "production") {
          debug == null ? void 0 : debug(poly.slice(0, 4).join(', '));
        }

        if (!isPointInPolygon([clientX, clientY], poly)) {
          close();
        } else if (restMs) {
          timeoutId = setTimeout(onClose, restMs);
        }
      };
    };
  }

  const DEFAULT_ID = 'floating-ui-root';
  const useFloatingPortalNode = function (_temp) {
    let {
      id = DEFAULT_ID,
      enabled = true
    } = _temp === void 0 ? {} : _temp;
    const [portalEl, setPortalEl] = React__namespace.useState(null);
    index(() => {
      if (!enabled) {
        return;
      }

      const rootNode = document.getElementById(id);

      if (rootNode) {
        setPortalEl(rootNode);
      } else {
        const newPortalEl = document.createElement('div');
        newPortalEl.id = id;
        setPortalEl(newPortalEl);

        if (!document.body.contains(newPortalEl)) {
          document.body.appendChild(newPortalEl);
        }
      }
    }, [id, enabled]);
    return portalEl;
  };
  /**
   * Portals your floating element outside of the main app node.
   * @see https://floating-ui.com/docs/FloatingPortal
   */

  const FloatingPortal = _ref => {
    let {
      children,
      id = DEFAULT_ID,
      root = null
    } = _ref;
    const portalNode = useFloatingPortalNode({
      id,
      enabled: !root
    });

    if (root) {
      return /*#__PURE__*/reactDom$1.createPortal(children, root);
    }

    if (portalNode) {
      return /*#__PURE__*/reactDom$1.createPortal(children, portalNode);
    }

    return null;
  };

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

  // Avoid Chrome DevTools blue warning
  function getPlatform() {
    const uaData = navigator.userAgentData;

    if (uaData != null && uaData.platform) {
      return uaData.platform;
    }

    return navigator.platform;
  }
  function getUserAgent() {
    const uaData = navigator.userAgentData;

    if (uaData != null && uaData.brands) {
      return uaData.brands.map(_ref => {
        let {
          brand,
          version
        } = _ref;
        return brand + "/" + version;
      }).join(' ');
    }

    return navigator.userAgent;
  }

  const identifier = 'data-floating-ui-scroll-lock';
  /**
   * Provides base styling for a fixed overlay element to dim content or block
   * pointer events behind a floating element.
   * It's a regular `<div>`, so it can be styled via any CSS solution you prefer.
   * @see https://floating-ui.com/docs/FloatingOverlay
   */

  const FloatingOverlay = /*#__PURE__*/React__namespace.forwardRef(function FloatingOverlay(_ref, ref) {
    let {
      lockScroll = false,
      ...rest
    } = _ref;
    index(() => {
      var _window$visualViewpor, _window$visualViewpor2, _window$visualViewpor3, _window$visualViewpor4;

      if (!lockScroll) {
        return;
      }

      const alreadyLocked = document.body.hasAttribute(identifier);

      if (alreadyLocked) {
        return;
      }

      document.body.setAttribute(identifier, ''); // RTL <body> scrollbar

      const scrollbarX = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft;
      const paddingProp = scrollbarX ? 'paddingLeft' : 'paddingRight';
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // Only iOS doesn't respect `overflow: hidden` on document.body, and this
      // technique has fewer side effects.

      if (!/iP(hone|ad|od)|iOS/.test(getPlatform())) {
        Object.assign(document.body.style, {
          overflow: 'hidden',
          [paddingProp]: scrollbarWidth + "px"
        });
        return () => {
          document.body.removeAttribute(identifier);
          Object.assign(document.body.style, {
            overflow: '',
            [paddingProp]: ''
          });
        };
      } // iOS 12 does not support `visuaViewport`.


      const offsetLeft = (_window$visualViewpor = (_window$visualViewpor2 = window.visualViewport) == null ? void 0 : _window$visualViewpor2.offsetLeft) != null ? _window$visualViewpor : 0;
      const offsetTop = (_window$visualViewpor3 = (_window$visualViewpor4 = window.visualViewport) == null ? void 0 : _window$visualViewpor4.offsetTop) != null ? _window$visualViewpor3 : 0;
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;
      Object.assign(document.body.style, {
        position: 'fixed',
        overflow: 'hidden',
        top: -(scrollY - Math.floor(offsetTop)) + "px",
        left: -(scrollX - Math.floor(offsetLeft)) + "px",
        right: '0',
        [paddingProp]: scrollbarWidth + "px"
      });
      return () => {
        Object.assign(document.body.style, {
          position: '',
          overflow: '',
          top: '',
          left: '',
          right: '',
          [paddingProp]: ''
        });
        document.body.removeAttribute(identifier);
        window.scrollTo(scrollX, scrollY);
      };
    }, [lockScroll]);
    return /*#__PURE__*/React__namespace.createElement("div", _extends({
      ref: ref
    }, rest, {
      style: {
        position: 'fixed',
        overflow: 'auto',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...rest.style
      }
    }));
  });

  var getDefaultParent = function (originalTarget) {
      if (typeof document === 'undefined') {
          return null;
      }
      var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
      return sampleTarget.ownerDocument.body;
  };
  var counterMap = new WeakMap();
  var uncontrolledNodes = new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var hideOthers = function (originalTarget, parentNode, markerName) {
      if (parentNode === void 0) { parentNode = getDefaultParent(originalTarget); }
      if (markerName === void 0) { markerName = "data-aria-hidden"; }
      var targets = Array.isArray(originalTarget) ? originalTarget : [originalTarget];
      if (!markerMap[markerName]) {
          markerMap[markerName] = new WeakMap();
      }
      var markerCounter = markerMap[markerName];
      var hiddenNodes = [];
      var elementsToKeep = new Set();
      var keep = (function (el) {
          if (!el || elementsToKeep.has(el)) {
              return;
          }
          elementsToKeep.add(el);
          keep(el.parentNode);
      });
      targets.forEach(keep);
      var deep = function (parent) {
          if (!parent || targets.indexOf(parent) >= 0) {
              return;
          }
          Array.prototype.forEach.call(parent.children, function (node) {
              if (elementsToKeep.has(node)) {
                  deep(node);
              }
              else {
                  var attr = node.getAttribute('aria-hidden');
                  var alreadyHidden = attr !== null && attr !== 'false';
                  var counterValue = (counterMap.get(node) || 0) + 1;
                  var markerValue = (markerCounter.get(node) || 0) + 1;
                  counterMap.set(node, counterValue);
                  markerCounter.set(node, markerValue);
                  hiddenNodes.push(node);
                  if (counterValue === 1 && alreadyHidden) {
                      uncontrolledNodes.set(node, true);
                  }
                  if (markerValue === 1) {
                      node.setAttribute(markerName, 'true');
                  }
                  if (!alreadyHidden) {
                      node.setAttribute('aria-hidden', 'true');
                  }
              }
          });
      };
      deep(parentNode);
      elementsToKeep.clear();
      lockCount++;
      return function () {
          hiddenNodes.forEach(function (node) {
              var counterValue = counterMap.get(node) - 1;
              var markerValue = markerCounter.get(node) - 1;
              counterMap.set(node, counterValue);
              markerCounter.set(node, markerValue);
              if (!counterValue) {
                  if (!uncontrolledNodes.has(node)) {
                      node.removeAttribute('aria-hidden');
                  }
                  uncontrolledNodes.delete(node);
              }
              if (!markerValue) {
                  node.removeAttribute(markerName);
              }
          });
          lockCount--;
          if (!lockCount) {
              counterMap = new WeakMap();
              counterMap = new WeakMap();
              uncontrolledNodes = new WeakMap();
              markerMap = {};
          }
      };
  };

  /**
   * Find the real active element. Traverses into shadowRoots.
   */
  function activeElement(doc) {
    let activeElement = doc.activeElement;

    while (((_activeElement = activeElement) == null ? void 0 : (_activeElement$shadow = _activeElement.shadowRoot) == null ? void 0 : _activeElement$shadow.activeElement) != null) {
      var _activeElement, _activeElement$shadow;

      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
  }

  function getAncestors(nodes, id) {
    var _nodes$find;

    let allAncestors = [];
    let currentParentId = (_nodes$find = nodes.find(node => node.id === id)) == null ? void 0 : _nodes$find.parentId;

    while (currentParentId) {
      const currentNode = nodes.find(node => node.id === currentParentId);
      currentParentId = currentNode == null ? void 0 : currentNode.parentId;

      if (currentNode) {
        allAncestors = allAncestors.concat(currentNode);
      }
    }

    return allAncestors;
  }

  const TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled])," + "[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
  function isTypeableElement(element) {
    return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
  }

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function useLatestRef(value) {
    const ref = React.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }

  function focus(el, preventScroll) {
    if (preventScroll === void 0) {
      preventScroll = false;
    }

    // `pointerDown` clicks occur before `focus`, so the button will steal the
    // focus unless we wait a frame.
    requestAnimationFrame(() => {
      el == null ? void 0 : el.focus({
        preventScroll
      });
    });
  }

  const SELECTOR = 'select:not([disabled]),a[href],button:not([disabled]),[tabindex],' + 'iframe,object,embed,area[href],audio[controls],video[controls],' + TYPEABLE_SELECTOR;
  const FocusGuard = /*#__PURE__*/React__namespace.forwardRef(function FocusGuard(props, ref) {
    return /*#__PURE__*/React__namespace.createElement("span", _extends({}, props, {
      ref: ref,
      tabIndex: 0,
      style: {
        position: 'fixed',
        opacity: '0',
        pointerEvents: 'none',
        outline: '0'
      }
    }));
  });

  /**
   * Provides focus management for the floating element.
   * @see https://floating-ui.com/docs/FloatingFocusManager
   */
  function FloatingFocusManager(_ref) {
    var _tree$nodesRef$curren;

    let {
      context: {
        refs,
        nodeId,
        onOpenChange,
        dataRef,
        events
      },
      children,
      order = ['content'],
      endGuard = true,
      preventTabbing = false,
      initialFocus = 0,
      returnFocus = true,
      modal = true
    } = _ref;
    const orderRef = useLatestRef(order);
    const onOpenChangeRef = useLatestRef(onOpenChange);
    const tree = useFloatingTree();
    const root = (tree == null ? void 0 : (_tree$nodesRef$curren = tree.nodesRef.current.find(node => node.id === nodeId)) == null ? void 0 : _tree$nodesRef$curren.parentId) == null;
    const getTabbableElements = React__namespace.useCallback(() => {
      return orderRef.current.map(type => {
        if (type === 'reference') {
          return refs.domReference.current;
        }

        if (refs.floating.current && type === 'floating') {
          return refs.floating.current;
        }

        if (type === 'content') {
          var _refs$floating$curren, _refs$floating$curren2;

          return Array.from((_refs$floating$curren = (_refs$floating$curren2 = refs.floating.current) == null ? void 0 : _refs$floating$curren2.querySelectorAll(SELECTOR)) != null ? _refs$floating$curren : []);
        }

        return null;
      }).flat().filter(el => {
        if (el === refs.floating.current || el === refs.domReference.current) {
          return true;
        }

        if (isHTMLElement(el)) {
          var _el$getAttribute;

          const tabIndex = (_el$getAttribute = el.getAttribute('tabindex')) != null ? _el$getAttribute : '0';
          return tabIndex[0].trim() !== '-';
        }
      });
    }, [orderRef, refs]);
    React__namespace.useEffect(() => {
      if (!modal) {
        return;
      } // If the floating element has no focusable elements inside it, fallback
      // to focusing the floating element and preventing tab navigation


      const noTabbableContentElements = getTabbableElements().filter(el => el !== refs.floating.current && el !== refs.domReference.current).length === 0;

      function onKeyDown(event) {
        if (event.key === 'Tab') {
          if (preventTabbing || noTabbableContentElements) {
            stopEvent(event);
          }

          const els = getTabbableElements();
          const target = 'composedPath' in event ? event.composedPath()[0] : // TS thinks `event` is of type never as it assumes all browsers
          // support composedPath, but browsers without shadow dom don't
          event.target;

          if (orderRef.current[0] === 'reference' && target === refs.domReference.current) {
            stopEvent(event);

            if (event.shiftKey) {
              focus(els[els.length - 1]);
            } else {
              focus(els[1]);
            }
          }

          if (orderRef.current[1] === 'floating' && target === refs.floating.current && event.shiftKey) {
            stopEvent(event);
            focus(els[0]);
          }
        }
      }

      const doc = getDocument(refs.floating.current);
      doc.addEventListener('keydown', onKeyDown);
      return () => {
        doc.removeEventListener('keydown', onKeyDown);
      };
    }, [preventTabbing, modal, getTabbableElements, orderRef, refs]);
    React__namespace.useEffect(() => {
      function onFocusOut(event) {
        var _refs$floating$curren3, _getAncestors;

        const relatedTarget = event.relatedTarget;
        const focusMovedOutsideFloating = !((_refs$floating$curren3 = refs.floating.current) != null && _refs$floating$curren3.contains(relatedTarget));
        const focusMovedOutsideReference = isElement(refs.domReference.current) && !refs.domReference.current.contains(relatedTarget);
        const isChildOpen = tree && getChildren(tree.nodesRef.current, nodeId).length > 0;
        const isParentRelated = tree && event.currentTarget === refs.domReference.current && ((_getAncestors = getAncestors(tree.nodesRef.current, nodeId)) == null ? void 0 : _getAncestors.some(node => {
          var _node$context, _node$context$refs$fl;

          return (_node$context = node.context) == null ? void 0 : (_node$context$refs$fl = _node$context.refs.floating.current) == null ? void 0 : _node$context$refs$fl.contains(relatedTarget);
        }));

        if (focusMovedOutsideFloating && focusMovedOutsideReference && !isChildOpen && !isParentRelated) {
          onOpenChangeRef.current(false);
        }
      }

      const floating = refs.floating.current;
      const reference = refs.domReference.current;

      if (floating && isHTMLElement(reference)) {
        !modal && floating.addEventListener('focusout', onFocusOut);
        !modal && reference.addEventListener('focusout', onFocusOut);
        let cleanup;

        if (modal) {
          if (orderRef.current.includes('reference')) {
            cleanup = hideOthers([reference, floating]);
          } else {
            cleanup = hideOthers(floating);
          }
        }

        return () => {
          !modal && floating.removeEventListener('focusout', onFocusOut);
          !modal && reference.removeEventListener('focusout', onFocusOut);
          cleanup == null ? void 0 : cleanup();
        };
      }
    }, [nodeId, tree, modal, onOpenChangeRef, orderRef, dataRef, getTabbableElements, refs]);
    React__namespace.useEffect(() => {
      // Retain `returnFocus` behavior for root nodes
      if (preventTabbing && !root) {
        return;
      }

      const floating = refs.floating.current;
      const doc = getDocument(floating);
      let returnFocusValue = returnFocus;
      let preventReturnFocusScroll = false;
      let previouslyFocusedElement = activeElement(doc);

      if (previouslyFocusedElement === doc.body && refs.domReference.current) {
        previouslyFocusedElement = refs.domReference.current;
      }

      if (!preventTabbing) {
        if (typeof initialFocus === 'number') {
          var _getTabbableElements$;

          focus((_getTabbableElements$ = getTabbableElements()[initialFocus]) != null ? _getTabbableElements$ : floating);
        } else if (isHTMLElement(initialFocus == null ? void 0 : initialFocus.current)) {
          var _initialFocus$current;

          focus((_initialFocus$current = initialFocus.current) != null ? _initialFocus$current : floating);
        }
      } // Dismissing via outside `pointerdown` should always ignore `returnFocus`
      // to prevent unwanted scrolling.


      function onDismiss(allowReturnFocus) {
        if (allowReturnFocus === void 0) {
          allowReturnFocus = false;
        }

        if (typeof allowReturnFocus === 'object') {
          returnFocusValue = true;
          preventReturnFocusScroll = allowReturnFocus.preventScroll;
        } else {
          returnFocusValue = allowReturnFocus;
        }
      }

      events.on('dismiss', onDismiss);
      return () => {
        events.off('dismiss', onDismiss);

        if (returnFocusValue && isHTMLElement(previouslyFocusedElement)) {
          focus(previouslyFocusedElement, preventReturnFocusScroll);
        }
      };
    }, [preventTabbing, getTabbableElements, initialFocus, returnFocus, refs, events, root]);

    const isTypeableCombobox = () => {
      var _refs$domReference$cu;

      return ((_refs$domReference$cu = refs.domReference.current) == null ? void 0 : _refs$domReference$cu.getAttribute('role')) === 'combobox' && isTypeableElement(refs.domReference.current);
    };

    return /*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, modal && /*#__PURE__*/React__namespace.createElement(FocusGuard, {
      onFocus: event => {
        if (isTypeableCombobox()) {
          return;
        }

        stopEvent(event);
        const els = getTabbableElements();

        if (order[0] === 'reference') {
          focus(els[0]);
        } else {
          focus(els[els.length - 1]);
        }
      }
    }), /*#__PURE__*/React__namespace.cloneElement(children, order.includes('floating') ? {
      tabIndex: 0
    } : {}), modal && endGuard && /*#__PURE__*/React__namespace.createElement(FocusGuard, {
      onFocus: event => {
        if (isTypeableCombobox()) {
          return;
        }

        stopEvent(event);
        focus(getTabbableElements()[0]);
      }
    }));
  }

  function usePrevious(value) {
    const ref = React.useRef();
    index(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  function getDelay(value, prop, pointerType) {
    if (pointerType && pointerType !== 'mouse') {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    return value == null ? void 0 : value[prop];
  }

  /**
   * Adds hover event listeners that change the open state, like CSS :hover.
   * @see https://floating-ui.com/docs/useHover
   */
  const useHover = function (context, _temp) {
    let {
      enabled = true,
      delay = 0,
      handleClose = null,
      mouseOnly = false,
      restMs = 0
    } = _temp === void 0 ? {} : _temp;
    const {
      open,
      onOpenChange,
      dataRef,
      events,
      refs
    } = context;
    const tree = useFloatingTree();
    const parentId = useFloatingParentNodeId();
    const onOpenChangeRef = useLatestRef(onOpenChange);
    const handleCloseRef = useLatestRef(handleClose);
    const previousOpen = usePrevious(open);
    const pointerTypeRef = React__namespace.useRef();
    const timeoutRef = React__namespace.useRef();
    const handlerRef = React__namespace.useRef();
    const restTimeoutRef = React__namespace.useRef();
    const blockMouseMoveRef = React__namespace.useRef(true);
    const performedPointerEventsMutationRef = React__namespace.useRef(false);
    React__namespace.useEffect(() => {
      if (!enabled) {
        return;
      }

      function onDismiss() {
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        blockMouseMoveRef.current = true;
      }

      events.on('dismiss', onDismiss);
      return () => {
        events.off('dismiss', onDismiss);
      };
    }, [enabled, events, refs]);
    React__namespace.useEffect(() => {
      if (!enabled || !handleCloseRef.current) {
        return;
      }

      function onLeave() {
        var _dataRef$current$open;

        const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;

        if (type != null && type.includes('mouse') && type !== 'mousedown') {
          onOpenChangeRef.current(false);
        }
      }

      const html = getDocument(refs.floating.current).documentElement;
      html.addEventListener('mouseleave', onLeave);
      return () => {
        html.removeEventListener('mouseleave', onLeave);
      };
    }, [refs, onOpenChangeRef, enabled, handleCloseRef, dataRef]);
    const closeWithDelay = React__namespace.useCallback(function (runElseBranch) {
      if (runElseBranch === void 0) {
        runElseBranch = true;
      }

      const closeDelay = getDelay(delay, 'close', pointerTypeRef.current);

      if (closeDelay && !handlerRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => onOpenChangeRef.current(false), closeDelay);
      } else if (runElseBranch) {
        clearTimeout(timeoutRef.current);
        onOpenChangeRef.current(false);
      }
    }, [delay, onOpenChangeRef]);
    const cleanupPointerMoveHandler = React__namespace.useCallback(() => {
      if (handlerRef.current) {
        getDocument(refs.floating.current).removeEventListener('pointermove', handlerRef.current);
        handlerRef.current = undefined;
      }
    }, [refs]);
    const clearPointerEvents = React__namespace.useCallback(() => {
      getDocument(refs.floating.current).body.style.pointerEvents = '';
      performedPointerEventsMutationRef.current = false;
    }, [refs]); // Registering the mouse events on the reference directly to bypass React's
    // delegation system. If the cursor was on a disabled element and then entered
    // the reference (no gap), `mouseenter` doesn't fire in the delegation system.

    React__namespace.useEffect(() => {
      if (!enabled) {
        return;
      }

      function isClickLikeOpenEvent() {
        return dataRef.current.openEvent ? ['click', 'mousedown'].includes(dataRef.current.openEvent.type) : false;
      }

      function onMouseEnter(event) {
        clearTimeout(timeoutRef.current);
        blockMouseMoveRef.current = false;

        if (open || mouseOnly && pointerTypeRef.current !== 'mouse' || restMs > 0 && getDelay(delay, 'open') === 0) {
          return;
        }

        dataRef.current.openEvent = event;
        const openDelay = getDelay(delay, 'open', pointerTypeRef.current);

        if (openDelay) {
          timeoutRef.current = setTimeout(() => {
            onOpenChangeRef.current(true);
          }, openDelay);
        } else {
          onOpenChangeRef.current(true);
        }
      }

      function onMouseLeave(event) {
        if (isClickLikeOpenEvent()) {
          return;
        }

        const doc = getDocument(refs.floating.current);
        clearTimeout(restTimeoutRef.current);

        if (handleCloseRef.current) {
          clearTimeout(timeoutRef.current);
          handlerRef.current && doc.removeEventListener('pointermove', handlerRef.current);
          handlerRef.current = handleCloseRef.current({ ...context,
            tree,
            x: event.clientX,
            y: event.clientY,

            onClose() {
              cleanupPointerMoveHandler();
              closeWithDelay();
            }

          });
          doc.addEventListener('pointermove', handlerRef.current);
          return;
        }

        closeWithDelay();
      } // Ensure the floating element closes after scrolling even if the pointer
      // did not move.
      // https://github.com/floating-ui/floating-ui/discussions/1692


      function onScrollMouseLeave(event) {
        if (isClickLikeOpenEvent()) {
          return;
        }

        handleCloseRef.current == null ? void 0 : handleCloseRef.current({ ...context,
          tree,
          x: event.clientX,
          y: event.clientY,
          leave: true,

          onClose() {
            cleanupPointerMoveHandler();
            closeWithDelay();
          }

        })(event);
      }

      const floating = refs.floating.current;
      const reference = refs.domReference.current;

      if (isElement(reference)) {
        open && reference.addEventListener('mouseleave', onScrollMouseLeave);
        floating == null ? void 0 : floating.addEventListener('mouseleave', onScrollMouseLeave);
        reference.addEventListener('mousemove', onMouseEnter, {
          once: true
        });
        reference.addEventListener('mouseenter', onMouseEnter);
        reference.addEventListener('mouseleave', onMouseLeave);
        return () => {
          open && reference.removeEventListener('mouseleave', onScrollMouseLeave);
          floating == null ? void 0 : floating.removeEventListener('mouseleave', onScrollMouseLeave);
          reference.removeEventListener('mousemove', onMouseEnter);
          reference.removeEventListener('mouseenter', onMouseEnter);
          reference.removeEventListener('mouseleave', onMouseLeave);
        };
      }
    }, [enabled, closeWithDelay, context, delay, handleCloseRef, dataRef, mouseOnly, onOpenChangeRef, open, tree, restMs, cleanupPointerMoveHandler, refs]); // Block pointer-events of every element other than the reference and floating
    // while the floating element is open and has a `handleClose` handler. Also
    // handles nested floating elements.
    // https://github.com/floating-ui/floating-ui/issues/1722

    index(() => {
      if (!enabled) {
        return;
      }

      if (open && handleCloseRef.current) {
        getDocument(refs.floating.current).body.style.pointerEvents = 'none';
        performedPointerEventsMutationRef.current = true;
        const reference = refs.domReference.current;
        const floating = refs.floating.current;

        if (isElement(reference) && floating) {
          var _tree$nodesRef$curren, _tree$nodesRef$curren2;

          const parentFloating = tree == null ? void 0 : (_tree$nodesRef$curren = tree.nodesRef.current.find(node => node.id === parentId)) == null ? void 0 : (_tree$nodesRef$curren2 = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren2.refs.floating.current;

          if (parentFloating) {
            parentFloating.style.pointerEvents = '';
          }

          reference.style.pointerEvents = 'auto';
          floating.style.pointerEvents = 'auto';
          return () => {
            reference.style.pointerEvents = '';
            floating.style.pointerEvents = '';
          };
        }
      }
    }, [enabled, open, parentId, refs, tree, handleCloseRef, dataRef]);
    index(() => {
      if (previousOpen && !open) {
        pointerTypeRef.current = undefined;
        cleanupPointerMoveHandler();
        clearPointerEvents();
      }
    });
    React__namespace.useEffect(() => {
      return () => {
        cleanupPointerMoveHandler();
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);

        if (performedPointerEventsMutationRef.current) {
          clearPointerEvents();
        }
      };
    }, [cleanupPointerMoveHandler, clearPointerEvents]);

    if (!enabled) {
      return {};
    }

    function setPointerRef(event) {
      pointerTypeRef.current = event.pointerType;
    }

    return {
      reference: {
        onPointerDown: setPointerRef,
        onPointerEnter: setPointerRef,

        onMouseMove() {
          if (open || restMs === 0) {
            return;
          }

          clearTimeout(restTimeoutRef.current);
          restTimeoutRef.current = setTimeout(() => {
            if (!blockMouseMoveRef.current) {
              onOpenChange(true);
            }
          }, restMs);
        }

      },
      floating: {
        onMouseEnter() {
          clearTimeout(timeoutRef.current);
        },

        onMouseLeave() {
          closeWithDelay(false);
        }

      }
    };
  };

  const FloatingDelayGroupContext = /*#__PURE__*/React__namespace.createContext({
    delay: 1000,
    initialDelay: 1000,
    currentId: null,
    setCurrentId: () => {},
    setState: () => {}
  });
  const useDelayGroupContext = () => React__namespace.useContext(FloatingDelayGroupContext);
  /**
   * Provides context for a group of floating elements that should share a
   * `delay`.
   * @see https://floating-ui.com/docs/FloatingDelayGroup
   */

  const FloatingDelayGroup = _ref => {
    let {
      children,
      delay
    } = _ref;
    const [state, setState] = React__namespace.useState({
      delay,
      initialDelay: delay,
      currentId: null
    });
    const setCurrentId = React__namespace.useCallback(currentId => {
      setState(state => ({ ...state,
        currentId
      }));
    }, []);
    return /*#__PURE__*/React__namespace.createElement(FloatingDelayGroupContext.Provider, {
      value: React__namespace.useMemo(() => ({ ...state,
        setState,
        setCurrentId
      }), [state, setState, setCurrentId])
    }, children);
  };
  const useDelayGroup = (_ref2, _ref3) => {
    let {
      open,
      onOpenChange
    } = _ref2;
    let {
      id
    } = _ref3;
    const {
      currentId,
      initialDelay,
      setState
    } = useDelayGroupContext();
    const onOpenChangeRef = useLatestRef(onOpenChange);
    React__namespace.useEffect(() => {
      if (currentId && onOpenChangeRef.current) {
        setState(state => ({ ...state,
          delay: {
            open: 1,
            close: getDelay(initialDelay, 'close')
          }
        }));

        if (currentId !== id) {
          onOpenChangeRef.current(false);
        }
      }
    }, [id, onOpenChangeRef, setState, currentId, initialDelay]);
    React__namespace.useEffect(() => {
      if (!open && currentId === id && onOpenChangeRef.current) {
        onOpenChangeRef.current(false);
        setState(state => ({ ...state,
          delay: initialDelay,
          currentId: null
        }));
      }
    }, [open, setState, currentId, id, onOpenChangeRef, initialDelay]);
  };

  function getArgsWithCustomFloatingHeight(args, prop) {
    return { ...args,
      rects: { ...args.rects,
        floating: { ...args.rects.floating,
          height: args.elements.floating[prop]
        }
      }
    };
  }

  const inner = options => ({
    name: 'inner',
    options,

    async fn(middlewareArguments) {
      const {
        listRef,
        overflowRef,
        onFallbackChange,
        offset: innerOffset = 0,
        index = 0,
        minItemsVisible = 4,
        referenceOverflowThreshold = 0,
        ...detectOverflowOptions
      } = options;
      const {
        rects,
        elements: {
          floating
        }
      } = middlewareArguments;
      const item = listRef.current[index];

      if (process.env.NODE_ENV !== "production") {
        if (!middlewareArguments.placement.startsWith('bottom')) {
          console.warn(['Floating UI: `placement` side must be "bottom" when using the', '`inner` middleware.'].join(' '));
        }
      }

      if (!item) {
        return {};
      }

      const nextArgs = { ...middlewareArguments,
        ...(await reactDom.offset(-item.offsetTop - rects.reference.height / 2 - item.offsetHeight / 2 - innerOffset).fn(middlewareArguments))
      };
      const overflow = await reactDom.detectOverflow(getArgsWithCustomFloatingHeight(nextArgs, 'scrollHeight'), detectOverflowOptions);
      const refOverflow = await reactDom.detectOverflow(nextArgs, { ...detectOverflowOptions,
        elementContext: 'reference'
      });
      const diffY = Math.max(0, overflow.top);
      const nextY = nextArgs.y + diffY;
      const maxHeight = Math.max(0, floating.scrollHeight - diffY - Math.max(0, overflow.bottom));
      floating.style.maxHeight = maxHeight + "px";
      floating.scrollTop = diffY; // There is not enough space, fallback to standard anchored positioning

      if (onFallbackChange) {
        if (floating.offsetHeight < item.offsetHeight * Math.min(minItemsVisible, listRef.current.length - 1) - 1 || refOverflow.top >= -referenceOverflowThreshold || refOverflow.bottom >= -referenceOverflowThreshold) {
          reactDom$1.flushSync(() => onFallbackChange(true));
        } else {
          reactDom$1.flushSync(() => onFallbackChange(false));
        }
      }

      if (overflowRef) {
        overflowRef.current = await reactDom.detectOverflow(getArgsWithCustomFloatingHeight({ ...nextArgs,
          y: nextY
        }, 'offsetHeight'), detectOverflowOptions);
      }

      return {
        y: nextY
      };
    }

  });
  const useInnerOffset = (_ref, _ref2) => {
    let {
      open,
      refs
    } = _ref;
    let {
      enabled = true,
      overflowRef,
      onChange
    } = _ref2;
    const onChangeRef = useLatestRef(onChange);
    const controlledScrollingRef = React__namespace.useRef(false);
    const prevScrollTopRef = React__namespace.useRef(null);
    const initialOverflowRef = React__namespace.useRef(null);
    React__namespace.useEffect(() => {
      if (!enabled) {
        return;
      }

      function onWheel(e) {
        if (e.ctrlKey || !el || overflowRef.current == null) {
          return;
        }

        const dY = e.deltaY;
        const isAtTop = overflowRef.current.top >= -0.5;
        const isAtBottom = overflowRef.current.bottom >= -0.5;
        const remainingScroll = el.scrollHeight - el.clientHeight;
        const sign = dY < 0 ? -1 : 1;
        const method = dY < 0 ? 'max' : 'min';

        if (el.scrollHeight <= el.clientHeight) {
          return;
        }

        if (!isAtTop && dY > 0 || !isAtBottom && dY < 0) {
          e.preventDefault();
          reactDom$1.flushSync(() => {
            onChangeRef.current(d => d + Math[method](dY, remainingScroll * sign));
          });
        } else if (/firefox/i.test(getUserAgent())) {
          // Needed to propagate scrolling during momentum scrolling phase once
          // it gets limited by the boundary. UX improvement, not critical.
          el.scrollTop += dY;
        }
      }

      const el = refs.floating.current;

      if (open && el) {
        el.addEventListener('wheel', onWheel); // Wait for the position to be ready.

        requestAnimationFrame(() => {
          prevScrollTopRef.current = el.scrollTop;

          if (overflowRef.current != null) {
            initialOverflowRef.current = { ...overflowRef.current
            };
          }
        });
        return () => {
          prevScrollTopRef.current = null;
          initialOverflowRef.current = null;
          el.removeEventListener('wheel', onWheel);
        };
      }
    }, [enabled, open, refs, overflowRef, onChangeRef]);

    if (!enabled) {
      return {};
    }

    return {
      floating: {
        onKeyDown() {
          controlledScrollingRef.current = true;
        },

        onWheel() {
          controlledScrollingRef.current = false;
        },

        onPointerMove() {
          controlledScrollingRef.current = false;
        },

        onScroll() {
          const el = refs.floating.current;

          if (!overflowRef.current || !el || !controlledScrollingRef.current) {
            return;
          }

          if (prevScrollTopRef.current !== null) {
            const scrollDiff = el.scrollTop - prevScrollTopRef.current;

            if (overflowRef.current.bottom < -0.5 && scrollDiff < -1 || overflowRef.current.top < -0.5 && scrollDiff > 1) {
              reactDom$1.flushSync(() => onChange(d => d + scrollDiff));
            }
          } // [Firefox] Wait for the height change to have been applied.


          requestAnimationFrame(() => {
            prevScrollTopRef.current = el.scrollTop;
          });
        }

      }
    };
  };

  /**
   * Adds relevant screen reader props for a given element `role`.
   * @see https://floating-ui.com/docs/useRole
   */
  const useRole = function (_ref, _temp) {
    let {
      open
    } = _ref;
    let {
      enabled = true,
      role = 'dialog'
    } = _temp === void 0 ? {} : _temp;
    const rootId = useId();
    const referenceId = useId();
    const floatingProps = {
      id: rootId,
      role
    };

    if (!enabled) {
      return {};
    }

    if (role === 'tooltip') {
      return {
        reference: {
          'aria-describedby': open ? rootId : undefined
        },
        floating: floatingProps
      };
    }

    return {
      reference: {
        'aria-expanded': open ? 'true' : 'false',
        'aria-haspopup': role,
        'aria-controls': open ? rootId : undefined,
        ...(role === 'listbox' && {
          role: 'combobox'
        }),
        ...(role === 'menu' && {
          id: referenceId
        })
      },
      floating: { ...floatingProps,
        ...(role === 'menu' && {
          'aria-labelledby': referenceId
        })
      }
    };
  };

  /**
   * Adds click event listeners that change the open state.
   * @see https://floating-ui.com/docs/useClick
   */
  const useClick = function (_ref, _temp) {
    let {
      open,
      onOpenChange,
      dataRef,
      refs
    } = _ref;
    let {
      enabled = true,
      pointerDown = false,
      toggle = true,
      ignoreMouse = false
    } = _temp === void 0 ? {} : _temp;
    const pointerTypeRef = React__namespace.useRef();

    function isButton() {
      var _refs$domReference$cu;

      return ((_refs$domReference$cu = refs.domReference.current) == null ? void 0 : _refs$domReference$cu.tagName) === 'BUTTON';
    }

    function isSpaceIgnored() {
      return isTypeableElement(refs.domReference.current);
    }

    if (!enabled) {
      return {};
    }

    return {
      reference: {
        onPointerDown(event) {
          pointerTypeRef.current = event.pointerType;
        },

        onMouseDown(event) {
          // Ignore all buttons except for the "main" button.
          // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
          if (event.button !== 0) {
            return;
          }

          if (pointerTypeRef.current === 'mouse' && ignoreMouse) {
            return;
          }

          if (!pointerDown) {
            return;
          }

          if (open) {
            if (toggle && (dataRef.current.openEvent ? dataRef.current.openEvent.type === 'mousedown' : true)) {
              onOpenChange(false);
            }
          } else {
            onOpenChange(true);
          }

          dataRef.current.openEvent = event.nativeEvent;
        },

        onClick(event) {
          if (pointerDown && pointerTypeRef.current) {
            pointerTypeRef.current = undefined;
            return;
          }

          if (pointerTypeRef.current === 'mouse' && ignoreMouse) {
            return;
          }

          if (open) {
            if (toggle && (dataRef.current.openEvent ? dataRef.current.openEvent.type === 'click' : true)) {
              onOpenChange(false);
            }
          } else {
            onOpenChange(true);
          }

          dataRef.current.openEvent = event.nativeEvent;
        },

        onKeyDown(event) {
          pointerTypeRef.current = undefined;

          if (isButton()) {
            return;
          }

          if (event.key === ' ' && !isSpaceIgnored()) {
            // Prvent scrolling
            event.preventDefault();
          }

          if (event.key === 'Enter') {
            if (open) {
              if (toggle) {
                onOpenChange(false);
              }
            } else {
              onOpenChange(true);
            }
          }
        },

        onKeyUp(event) {
          if (isButton() || isSpaceIgnored()) {
            return;
          }

          if (event.key === ' ') {
            if (open) {
              if (toggle) {
                onOpenChange(false);
              }
            } else {
              onOpenChange(true);
            }
          }
        }

      }
    };
  };

  /**
   * Check whether the event.target is within the provided node. Uses event.composedPath if available for custom element support.
   *
   * @param event The event whose target/composedPath to check
   * @param node The node to check against
   * @returns Whether the event.target/composedPath is within the node.
   */
  function isEventTargetWithin(event, node) {
    if (node == null) {
      return false;
    }

    if ('composedPath' in event) {
      return event.composedPath().includes(node);
    } // TS thinks `event` is of type never as it assumes all browsers support composedPath, but browsers without shadow dom don't


    const e = event;
    return e.target != null && node.contains(e.target);
  }

  /**
   * Adds listeners that dismiss (close) the floating element.
   * @see https://floating-ui.com/docs/useDismiss
   */
  const useDismiss = function (_ref, _temp) {
    let {
      open,
      onOpenChange,
      refs,
      events,
      nodeId
    } = _ref;
    let {
      enabled = true,
      escapeKey = true,
      outsidePointerDown = true,
      referencePointerDown = false,
      ancestorScroll = false,
      bubbles = true
    } = _temp === void 0 ? {} : _temp;
    const tree = useFloatingTree();
    const onOpenChangeRef = useLatestRef(onOpenChange);
    const nested = useFloatingParentNodeId() != null;
    React__namespace.useEffect(() => {
      if (!open || !enabled) {
        return;
      }

      function onKeyDown(event) {
        if (event.key === 'Escape') {
          if (!bubbles && tree && getChildren(tree.nodesRef.current, nodeId).length > 0) {
            return;
          }

          events.emit('dismiss', {
            preventScroll: false
          });
          onOpenChangeRef.current(false);
        }
      }

      function onPointerDown(event) {
        const targetIsInsideChildren = tree && getChildren(tree.nodesRef.current, nodeId).some(node => {
          var _node$context;

          return isEventTargetWithin(event, (_node$context = node.context) == null ? void 0 : _node$context.refs.floating.current);
        });

        if (isEventTargetWithin(event, refs.floating.current) || isEventTargetWithin(event, refs.domReference.current) || targetIsInsideChildren) {
          return;
        }

        if (!bubbles && tree && getChildren(tree.nodesRef.current, nodeId).length > 0) {
          return;
        }

        events.emit('dismiss', nested ? {
          preventScroll: true
        } : false);
        onOpenChangeRef.current(false);
      }

      function onScroll() {
        onOpenChangeRef.current(false);
      }

      const doc = getDocument(refs.floating.current);
      escapeKey && doc.addEventListener('keydown', onKeyDown);
      outsidePointerDown && doc.addEventListener('pointerdown', onPointerDown);
      const ancestors = (ancestorScroll ? [...(isElement(refs.reference.current) ? reactDom.getOverflowAncestors(refs.reference.current) : []), ...(isElement(refs.floating.current) ? reactDom.getOverflowAncestors(refs.floating.current) : [])] : []).filter(ancestor => {
        var _doc$defaultView;

        return (// Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
          ancestor !== ((_doc$defaultView = doc.defaultView) == null ? void 0 : _doc$defaultView.visualViewport)
        );
      });
      ancestors.forEach(ancestor => ancestor.addEventListener('scroll', onScroll, {
        passive: true
      }));
      return () => {
        escapeKey && doc.removeEventListener('keydown', onKeyDown);
        outsidePointerDown && doc.removeEventListener('pointerdown', onPointerDown);
        ancestors.forEach(ancestor => ancestor.removeEventListener('scroll', onScroll));
      };
    }, [escapeKey, outsidePointerDown, events, tree, nodeId, open, onOpenChangeRef, ancestorScroll, enabled, bubbles, refs, nested]);

    if (!enabled) {
      return {};
    }

    return {
      reference: {
        onPointerDown() {
          if (referencePointerDown) {
            events.emit('dismiss');
            onOpenChange(false);
          }
        }

      }
    };
  };

  /**
   * Adds focus event listeners that change the open state, like CSS :focus.
   * @see https://floating-ui.com/docs/useFocus
   */
  const useFocus = function (_ref, _temp) {
    let {
      open,
      onOpenChange,
      dataRef,
      refs,
      events
    } = _ref;
    let {
      enabled = true,
      keyboardOnly = true
    } = _temp === void 0 ? {} : _temp;
    const pointerTypeRef = React__namespace.useRef('');
    const blockFocusRef = React__namespace.useRef(false);
    React__namespace.useEffect(() => {
      var _doc$defaultView;

      if (!enabled) {
        return;
      }

      const doc = getDocument(refs.floating.current);
      const win = (_doc$defaultView = doc.defaultView) != null ? _doc$defaultView : window;

      function onBlur() {
        if (pointerTypeRef.current && refs.domReference.current === activeElement(doc)) {
          blockFocusRef.current = !open;
        }
      }

      function onFocus() {
        setTimeout(() => {
          blockFocusRef.current = false;
          pointerTypeRef.current = '';
        });
      }

      win.addEventListener('focus', onFocus);
      win.addEventListener('blur', onBlur);
      return () => {
        win.removeEventListener('focus', onFocus);
        win.removeEventListener('blur', onBlur);
      };
    }, [refs, open, enabled]);
    React__namespace.useEffect(() => {
      if (!enabled) {
        return;
      }

      function onDismiss() {
        blockFocusRef.current = true;
      }

      events.on('dismiss', onDismiss);
      return () => {
        events.off('dismiss', onDismiss);
      };
    }, [events, enabled]);

    if (!enabled) {
      return {};
    }

    return {
      reference: {
        onPointerDown(_ref2) {
          let {
            pointerType
          } = _ref2;
          pointerTypeRef.current = pointerType;
          blockFocusRef.current = !!(pointerType && keyboardOnly);
        },

        onFocus(event) {
          var _dataRef$current$open, _refs$domReference$cu, _dataRef$current$open2;

          if (blockFocusRef.current) {
            return;
          } // Dismiss with click should ignore the subsequent `focus` trigger, but
          // only if the click originated inside the reference element.


          if (event.type === 'focus' && ((_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type) === 'mousedown' && (_refs$domReference$cu = refs.domReference.current) != null && _refs$domReference$cu.contains((_dataRef$current$open2 = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open2.target)) {
            return;
          }

          dataRef.current.openEvent = event.nativeEvent;
          onOpenChange(true);
        },

        onBlur(event) {
          var _refs$floating$curren, _refs$domReference$cu2;

          const target = event.relatedTarget; // When focusing the reference element (e.g. regular click), then
          // clicking into the floating element, prevent it from hiding.
          // Note: it must be focusable, e.g. `tabindex="-1"`.

          if ((_refs$floating$curren = refs.floating.current) != null && _refs$floating$curren.contains(target) || (_refs$domReference$cu2 = refs.domReference.current) != null && _refs$domReference$cu2.contains(target)) {
            return;
          }

          blockFocusRef.current = false;
          onOpenChange(false);
        }

      }
    };
  };

  const ARROW_UP = 'ArrowUp';
  const ARROW_DOWN = 'ArrowDown';
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_RIGHT = 'ArrowRight';

  function isIndexOutOfBounds(listRef, index) {
    return index < 0 || index >= listRef.current.length;
  }

  function findNonDisabledIndex(listRef, _temp) {
    let {
      startingIndex = -1,
      decrement = false,
      disabledIndices
    } = _temp === void 0 ? {} : _temp;
    const list = listRef.current;
    let index = startingIndex;

    do {
      var _list$index, _list$index2;

      index = index + (decrement ? -1 : 1);
    } while (index >= 0 && index <= list.length - 1 && (disabledIndices ? disabledIndices.includes(index) : list[index] == null || ((_list$index = list[index]) == null ? void 0 : _list$index.hasAttribute('disabled')) || ((_list$index2 = list[index]) == null ? void 0 : _list$index2.getAttribute('aria-disabled')) === 'true'));

    return index;
  }

  function doSwitch(orientation, vertical, horizontal) {
    switch (orientation) {
      case 'vertical':
        return vertical;

      case 'horizontal':
        return horizontal;

      default:
        return vertical || horizontal;
    }
  }

  function isMainOrientationKey(key, orientation) {
    const vertical = key === ARROW_UP || key === ARROW_DOWN;
    const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
    return doSwitch(orientation, vertical, horizontal);
  }

  function isMainOrientationToEndKey(key, orientation, rtl) {
    const vertical = key === ARROW_DOWN;
    const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
    return doSwitch(orientation, vertical, horizontal) || key === 'Enter' || key == ' ' || key === '';
  }

  function isCrossOrientationOpenKey(key, orientation, rtl) {
    const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
    const horizontal = key === ARROW_DOWN;
    return doSwitch(orientation, vertical, horizontal);
  }

  function isCrossOrientationCloseKey(key, orientation, rtl) {
    const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
    const horizontal = key === ARROW_UP;
    return doSwitch(orientation, vertical, horizontal);
  }

  function getMinIndex(listRef, disabledIndices) {
    return findNonDisabledIndex(listRef, {
      disabledIndices
    });
  }

  function getMaxIndex(listRef, disabledIndices) {
    return findNonDisabledIndex(listRef, {
      decrement: true,
      startingIndex: listRef.current.length,
      disabledIndices
    });
  }

  /**
   * Adds focus-managed indexed navigation via arrow keys to a list of items
   * within the floating element.
   * @see https://floating-ui.com/docs/useListNavigation
   */
  const useListNavigation = function (_ref, _temp2) {
    let {
      open,
      onOpenChange,
      refs
    } = _ref;
    let {
      listRef,
      activeIndex,
      onNavigate,
      enabled = true,
      selectedIndex = null,
      allowEscape = false,
      loop = false,
      nested = false,
      rtl = false,
      virtual = false,
      focusItemOnOpen = 'auto',
      focusItemOnHover = true,
      openOnArrowKeyDown = true,
      disabledIndices = openOnArrowKeyDown ? undefined : [],
      orientation = 'vertical'
    } = _temp2 === void 0 ? {
      listRef: {
        current: []
      },
      activeIndex: null,
      onNavigate: () => {}
    } : _temp2;

    if (process.env.NODE_ENV !== "production") {
      if (allowEscape) {
        if (!loop) {
          console.warn(['Floating UI: `useListNavigation` looping must be enabled to allow', 'escaping.'].join(' '));
        }

        if (!virtual) {
          console.warn(['Floating UI: `useListNavigation` must be virtual to allow', 'escaping.'].join(' '));
        }
      }
    }

    const parentId = useFloatingParentNodeId();
    const tree = useFloatingTree();
    const previousOpen = usePrevious(open);
    const focusItemOnOpenRef = React__namespace.useRef(focusItemOnOpen);
    const indexRef = React__namespace.useRef(selectedIndex != null ? selectedIndex : -1);
    const keyRef = React__namespace.useRef(null);
    const previousOnNavigateRef = useLatestRef(usePrevious(onNavigate));
    const onNavigateRef = useLatestRef(onNavigate);
    const disabledIndicesRef = useLatestRef(disabledIndices);
    const blockPointerLeaveRef = React__namespace.useRef(false);
    const frameRef = React__namespace.useRef(-1);
    const [activeId, setActiveId] = React__namespace.useState();
    const focusItem = React__namespace.useCallback((listRef, indexRef) => {
      // `pointerDown` clicks occur before `focus`, so the button will steal the
      // focus unless we wait a frame.
      frameRef.current = requestAnimationFrame(() => {
        if (virtual) {
          var _listRef$current$inde;

          setActiveId((_listRef$current$inde = listRef.current[indexRef.current]) == null ? void 0 : _listRef$current$inde.id);
        } else {
          var _listRef$current$inde2;

          (_listRef$current$inde2 = listRef.current[indexRef.current]) == null ? void 0 : _listRef$current$inde2.focus({
            preventScroll: true
          });
        }
      });
    }, [virtual]); // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
    // element. Also, reset `activeIndex` upon closing the floating element.

    index(() => {
      if (!enabled) {
        return;
      }

      if (!previousOpen && open && focusItemOnOpenRef.current && selectedIndex != null) {
        onNavigateRef.current(selectedIndex);
      } // Unset `activeIndex`. Since the user can specify `onNavigate`
      // conditionally (onNavigate: open ? setActiveIndex : setSelectedIndex)
      // we store and call the previous function


      if (previousOpen && !open) {
        cancelAnimationFrame(frameRef.current);
        indexRef.current = -1;
        previousOnNavigateRef.current == null ? void 0 : previousOnNavigateRef.current(null);
      }
    }, [open, previousOpen, selectedIndex, listRef, onNavigateRef, previousOnNavigateRef, focusItem, enabled]); // Sync `activeIndex` to be the focused item while the floating element is
    // open.

    index(() => {
      if (!enabled) {
        return;
      }

      if (open) {
        if (activeIndex == null) {
          if (selectedIndex != null) {
            return;
          } // Reset while the floating element was open (e.g. the list changed).


          if (previousOpen) {
            indexRef.current = -1;
            focusItem(listRef, indexRef);
          } // Initial sync


          if (!previousOpen && focusItemOnOpenRef.current && (keyRef.current != null || focusItemOnOpenRef.current === true && keyRef.current == null)) {
            indexRef.current = keyRef.current == null || isMainOrientationToEndKey(keyRef.current, orientation, rtl) || nested ? getMinIndex(listRef, disabledIndicesRef.current) : getMaxIndex(listRef, disabledIndicesRef.current);
            onNavigateRef.current(indexRef.current);
            focusItem(listRef, indexRef);
          }
        } else if (!isIndexOutOfBounds(listRef, activeIndex)) {
          indexRef.current = activeIndex;
          focusItem(listRef, indexRef);
        }
      }
    }, [open, previousOpen, activeIndex, selectedIndex, nested, listRef, onNavigateRef, focusItem, enabled, allowEscape, orientation, rtl, virtual, disabledIndicesRef]); // Ensure the parent floating element has focus when a nested child closes
    // to allow arrow key navigation to work after the pointer leaves the child.

    index(() => {
      if (!enabled) {
        return;
      }

      if (!open && previousOpen) {
        var _tree$nodesRef$curren, _tree$nodesRef$curren2;

        const parentFloating = tree == null ? void 0 : (_tree$nodesRef$curren = tree.nodesRef.current.find(node => node.id === parentId)) == null ? void 0 : (_tree$nodesRef$curren2 = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren2.refs.floating.current;

        if (parentFloating && !parentFloating.contains(activeElement(getDocument(parentFloating)))) {
          parentFloating.focus({
            preventScroll: true
          });
        }
      }
    }, [enabled, open, previousOpen, tree, parentId]);
    index(() => {
      keyRef.current = null;
    });

    function onKeyDown(event) {
      blockPointerLeaveRef.current = true;

      if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
        stopEvent(event);
        onOpenChange(false);

        if (isHTMLElement(refs.domReference.current)) {
          refs.domReference.current.focus();
        }

        return;
      }

      const currentIndex = indexRef.current;
      const minIndex = getMinIndex(listRef, disabledIndices);
      const maxIndex = getMaxIndex(listRef, disabledIndices);

      if (event.key === 'Home') {
        indexRef.current = minIndex;
        onNavigate(indexRef.current);
      }

      if (event.key === 'End') {
        indexRef.current = maxIndex;
        onNavigate(indexRef.current);
      }

      if (isMainOrientationKey(event.key, orientation)) {
        stopEvent(event); // Reset the index if no item is focused.

        if (open && !virtual && activeElement(event.currentTarget.ownerDocument) === event.currentTarget) {
          indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl) ? minIndex : maxIndex;
          onNavigate(indexRef.current);
          return;
        }

        if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
          if (loop) {
            indexRef.current = currentIndex >= maxIndex ? allowEscape && currentIndex !== listRef.current.length ? -1 : minIndex : findNonDisabledIndex(listRef, {
              startingIndex: currentIndex,
              disabledIndices
            });
          } else {
            indexRef.current = Math.min(maxIndex, findNonDisabledIndex(listRef, {
              startingIndex: currentIndex,
              disabledIndices
            }));
          }
        } else {
          if (loop) {
            indexRef.current = currentIndex <= minIndex ? allowEscape && currentIndex !== -1 ? listRef.current.length : maxIndex : findNonDisabledIndex(listRef, {
              startingIndex: currentIndex,
              decrement: true,
              disabledIndices
            });
          } else {
            indexRef.current = Math.max(minIndex, findNonDisabledIndex(listRef, {
              startingIndex: currentIndex,
              decrement: true,
              disabledIndices
            }));
          }
        }

        if (isIndexOutOfBounds(listRef, indexRef.current)) {
          onNavigate(null);
        } else {
          onNavigate(indexRef.current);
        }
      }
    }

    if (!enabled) {
      return {};
    }

    return {
      reference: { ...(virtual && open && activeIndex != null && {
          'aria-activedescendant': activeId
        }),

        onKeyDown(event) {
          blockPointerLeaveRef.current = true;

          if (virtual && open) {
            return onKeyDown(event);
          }

          const isNavigationKey = event.key.indexOf('Arrow') === 0 || event.key === 'Enter' || event.key === ' ' || event.key === '';

          if (isNavigationKey) {
            keyRef.current = event.key;
          }

          if (nested) {
            if (isCrossOrientationOpenKey(event.key, orientation, rtl)) {
              stopEvent(event);

              if (open) {
                indexRef.current = getMinIndex(listRef, disabledIndices);
                onNavigate(indexRef.current);
              } else {
                onOpenChange(true);
              }
            }

            return;
          }

          if (isMainOrientationKey(event.key, orientation)) {
            if (selectedIndex != null) {
              indexRef.current = selectedIndex;
            }

            stopEvent(event);

            if (!open && openOnArrowKeyDown) {
              onOpenChange(true);
            } else {
              onKeyDown(event);
            }

            if (open) {
              onNavigate(indexRef.current);
            }
          }
        }

      },
      floating: {
        'aria-orientation': orientation === 'both' ? undefined : orientation,
        ...(virtual && activeIndex != null && {
          'aria-activedescendant': activeId
        }),
        onKeyDown,

        onPointerMove() {
          blockPointerLeaveRef.current = false;
        }

      },
      item: {
        onFocus(_ref2) {
          let {
            currentTarget
          } = _ref2;
          const index = listRef.current.indexOf(currentTarget);

          if (index !== -1) {
            onNavigate(index);
          }
        },

        onClick: _ref3 => {
          let {
            currentTarget
          } = _ref3;
          return currentTarget.focus({
            preventScroll: true
          });
        },
        // Safari
        ...(focusItemOnHover && {
          onMouseMove(_ref4) {
            let {
              currentTarget
            } = _ref4;
            const target = currentTarget;

            if (target) {
              const index = listRef.current.indexOf(target);

              if (index !== -1) {
                onNavigate(index);
              }
            }
          },

          onPointerLeave() {
            if (!blockPointerLeaveRef.current) {
              indexRef.current = -1;
              focusItem(listRef, indexRef);
              onNavigateRef.current(null);

              if (!virtual) {
                var _refs$floating$curren;

                (_refs$floating$curren = refs.floating.current) == null ? void 0 : _refs$floating$curren.focus({
                  preventScroll: true
                });
              }
            }
          }

        })
      }
    };
  };

  /**
   * Provides a matching callback that can be used to focus an item as the user
   * types, often used in tandem with `useListNavigation()`.
   * @see https://floating-ui.com/docs/useTypeahead
   */
  const useTypeahead = function (_ref, _temp) {
    var _ref2;

    let {
      open,
      dataRef
    } = _ref;
    let {
      listRef,
      activeIndex,
      onMatch = () => {},
      enabled = true,
      findMatch = null,
      resetMs = 1000,
      ignoreKeys = [],
      selectedIndex = null
    } = _temp === void 0 ? {
      listRef: {
        current: []
      },
      activeIndex: null
    } : _temp;
    const timeoutIdRef = React__namespace.useRef();
    const stringRef = React__namespace.useRef('');
    const prevIndexRef = React__namespace.useRef((_ref2 = selectedIndex != null ? selectedIndex : activeIndex) != null ? _ref2 : -1);
    const matchIndexRef = React__namespace.useRef(null);
    index(() => {
      if (open) {
        clearTimeout(timeoutIdRef.current);
        matchIndexRef.current = null;
        stringRef.current = '';
      }
    }, [open]);
    index(() => {
      // Sync arrow key navigation but not typeahead navigation
      if (open && stringRef.current === '') {
        var _ref3;

        prevIndexRef.current = (_ref3 = selectedIndex != null ? selectedIndex : activeIndex) != null ? _ref3 : -1;
      }
    }, [open, selectedIndex, activeIndex]);

    function onKeyDown(event) {
      if (!event.currentTarget.contains(activeElement(getDocument(event.currentTarget)))) {
        return;
      }

      if (stringRef.current.length > 0 && stringRef.current[0] !== ' ') {
        dataRef.current.typing = true;

        if (event.key === ' ') {
          stopEvent(event);
        }
      }

      const listContent = listRef.current;

      if (listContent == null || ['Home', 'End', 'Escape', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ...ignoreKeys].includes(event.key)) {
        return;
      } // Bail out if the list contains a word like "llama" or "aaron". TODO:
      // allow it in this case, too.


      const allowRapidSuccessionOfFirstLetter = listContent.every(text => {
        var _text$, _text$2;

        return text ? ((_text$ = text[0]) == null ? void 0 : _text$.toLocaleLowerCase()) !== ((_text$2 = text[1]) == null ? void 0 : _text$2.toLocaleLowerCase()) : true;
      }); // Allows the user to cycle through items that start with the same letter
      // in rapid succession

      if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
        stringRef.current = '';
        prevIndexRef.current = matchIndexRef.current;
      }

      stringRef.current += event.key;
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        stringRef.current = '';
        prevIndexRef.current = matchIndexRef.current;
        dataRef.current.typing = false;
      }, resetMs);
      const prevIndex = prevIndexRef.current;
      const orderedList = [...listContent.slice((prevIndex != null ? prevIndex : 0) + 1), ...listContent.slice(0, (prevIndex != null ? prevIndex : 0) + 1)];
      const str = findMatch ? findMatch(orderedList, stringRef.current) : orderedList.find(text => (text == null ? void 0 : text.toLocaleLowerCase().indexOf(stringRef.current)) === 0);
      const index = str ? listContent.indexOf(str) : -1;

      if (index !== -1) {
        onMatch(index);
        matchIndexRef.current = index;
      }
    }

    if (!enabled) {
      return {};
    }

    return {
      reference: {
        onKeyDown
      },
      floating: {
        onKeyDown
      }
    };
  };

  exports.FloatingDelayGroup = FloatingDelayGroup;
  exports.FloatingFocusManager = FloatingFocusManager;
  exports.FloatingNode = FloatingNode;
  exports.FloatingOverlay = FloatingOverlay;
  exports.FloatingPortal = FloatingPortal;
  exports.FloatingTree = FloatingTree;
  exports.inner = inner;
  exports.safePolygon = safePolygon;
  exports.useClick = useClick;
  exports.useDelayGroup = useDelayGroup;
  exports.useDelayGroupContext = useDelayGroupContext;
  exports.useDismiss = useDismiss;
  exports.useFloating = useFloating;
  exports.useFloatingNodeId = useFloatingNodeId;
  exports.useFloatingParentNodeId = useFloatingParentNodeId;
  exports.useFloatingPortalNode = useFloatingPortalNode;
  exports.useFloatingTree = useFloatingTree;
  exports.useFocus = useFocus;
  exports.useHover = useHover;
  exports.useId = useId;
  exports.useInnerOffset = useInnerOffset;
  exports.useInteractions = useInteractions;
  exports.useListNavigation = useListNavigation;
  exports.useRole = useRole;
  exports.useTypeahead = useTypeahead;
  Object.keys(reactDom).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return reactDom[k]; }
    });
  });

  Object.defineProperty(exports, '__esModule', { value: true });

}));
