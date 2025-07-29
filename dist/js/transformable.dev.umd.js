(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Transformable"] = factory();
	else
		root["Transformable"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ transformable; }
});

;// ./src/js/Point.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Point = /*#__PURE__*/function () {
  function Point(x) {
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
    _classCallCheck(this, Point);
    this.x = x;
    this.y = y;
  }
  return _createClass(Point, [{
    key: "scale",
    value: function scale(factor) {
      return new Point(this.x * factor, this.y * factor);
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var factor = precision ? Math.pow(10, precision) : 1;
      return new Point(Math.round(this.x * factor) / factor, Math.round(this.y * factor) / factor);
    }
  }, {
    key: "sub",
    value: function sub(p) {
      return new Point(this.x - p.x, this.y - p.y);
    }
  }, {
    key: "add",
    value: function add(p) {
      return new Point(this.x + p.x, this.y + p.y);
    }
  }, {
    key: "mult",
    value: function mult(p) {
      return new Point(this.x * p.x, this.y * p.y);
    }
  }, {
    key: "divide",
    value: function divide(p) {
      return new Point(this.x / p.x, this.y / p.y);
    }
  }, {
    key: "nonzero",
    value: function nonzero() {
      return this.x !== 0 || this.y !== 0;
    }
  }, {
    key: "equals",
    value: function equals(p) {
      return this.x === p.x && this.y === p.y;
    }
  }, {
    key: "moreoreq",
    value: function moreoreq(p) {
      return {
        x: this.x >= p.x,
        y: this.y >= p.y
      };
    }
  }, {
    key: "lessoreq",
    value: function lessoreq(p) {
      return {
        x: this.x <= p.x,
        y: this.y <= p.y
      };
    }
  }, {
    key: "dot",
    value: function dot(p) {
      return this.x * p.x + this.y * p.y;
    }
  }, {
    key: "perpOnLine",
    value: function perpOnLine(p1, p2) {
      var k = ((p2.y - p1.y) * (this.x - p1.x) - (p2.x - p1.x) * (this.y - p1.y)) / (Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
      var x4 = this.x - k * (p2.y - p1.y);
      var y4 = this.y + k * (p2.x - p1.x);
      return new Point(x4, y4);
    }
  }, {
    key: "mag",
    value: function mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // toPos() {
    //   return new Pos(this.x, this.y);
    // }
  }]);
}();
/* harmony default export */ var js_Point = (Point);
;// ./src/js/Matrix.js

var _Matrix = function Matrix(a) {
  if (a == null || typeof a == 'undefined') return _Matrix.Identity();
  if (a instanceof Array) {
    this.elements = a.slice(0);
  } else {
    if (a instanceof _Matrix) {
      this.elements = a.elements.slice(0);
    } else {
      if (arguments.length == 6) {
        this.elements = [];
        var i = 0;
        while (i < arguments.length) this.elements.push(arguments[i++]);
      } else throw new Error("Can't create Matrix from supplied arguments. Array of 6 elements, Matrix or nothing only.");
    }
  }
  this.history = {
    undo: [],
    redo: []
  };
  return this;
};
_Matrix.Identity = function () {
  return new _Matrix([1, 0, 0, 1, 0, 0]);
};
_Matrix.prototype = {
  transformpoint: function transformpoint(pt) {
    var m = this.elements;
    return new js_Point(pt.x * m[0] + pt.y * m[2] + m[4], pt.x * m[1] + pt.y * m[3] + m[5]);
  },
  multiply: function multiply(els) {
    var me = this.elements;
    var a1 = me[0],
      b1 = me[1],
      c1 = me[2],
      d1 = me[3],
      e1 = me[4],
      f1 = me[5],
      a2 = els[0],
      b2 = els[1],
      c2 = els[2],
      d2 = els[3],
      e2 = els[4],
      f2 = els[5];

    /* matrix order (canvas compatible):
    * ace
    * bdf
    * 001
    */
    this.elements = [a1 * a2 + c1 * b2, b1 * a2 + d1 * b2, a1 * c2 + c1 * d2, b1 * c2 + d1 * d2, a1 * e2 + c1 * f2 + e1, b1 * e2 + d1 * f2 + f1];
    return this;
  },
  elementsequal: function elementsequal(a, b) {
    if (!a || !b) return false;
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3] && a[4] == b[4] && a[5] == b[5];
  },
  save: function save(els) {
    var h = this.history,
      last,
      k = typeof els === 'string' ? els : false;
    if (!els || k) els = this.elements;
    last = h.undo[h.undo.length - 1];
    if (!this.elementsequal(els, last)) {
      var l = h.undo.push(els.slice(0));
      h.redo = [];
      if (k) h.undo[k] = h.undo[l - 1];
    } else if (k) {
      h.undo[k] = last;
    }
  },
  undo: function undo(k) {
    var h = this.history.undo,
      len = h.length,
      cur = h.pop(),
      prev = typeof k == 'string' ? h[k] : h[h.length - 1];
    if (cur) this.history.redo.unshift(cur);
    this.elements = prev ? prev.slice(0) : this.identity();
  },
  redo: function redo() {
    var h = this.history.redo,
      len = h.length,
      cur = h.pop(),
      prev = h[h.length - 1];
    if (cur) this.history.undo.unshift(cur);
    this.elements = prev ? prev.slice(0) : this.identity();
  },
  reset: function reset() {
    this.elements = this.identity();
    return this;
  },
  determinant: function determinant() {
    var m = this.elements;
    return m[0] * m[3] - m[1] * m[2];
  },
  inverse: function inverse() {
    var me = this.elements,
      m = this.identity(),
      dt = this.determinant();
    if (dt < 1e-14) throw "Matrix not invertible.";
    m[0] = me[3] / dt;
    m[1] = -me[1] / dt;
    m[2] = -me[2] / dt;
    m[3] = me[0] / dt;
    m[4] = (me[2] * me[5] - me[3] * me[4]) / dt;
    m[5] = -(me[0] * me[5] - me[1] * me[4]) / dt;
    return new _Matrix(m);
  },
  invert: function invert() {
    return this.multiply(this.inverse().elements);
  },
  identity: function identity() {
    return [1, 0, 0, 1, 0, 0];
  },
  isIdentity: function isIdentity() {
    var m = this.elements;
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
  },
  translate: function translate(x, y) {
    if (x instanceof js_Point && !y) return this.multiply([1, 0, 0, 1, x.x, x.y]);
    return this.multiply([1, 0, 0, 1, x, y]);
  },
  scale: function scale(pt, s) {
    this.multiply([s, 0, 0, s, 0, 0]);
    var dp = pt.sub(pt.scale(s)).scale(1 / s); // keep pt in same place after scale from origin
    return this.translate(dp);
  },
  rotateAboutPoint: function rotateAboutPoint(pt, a) {
    var r = a * Math.PI / 180;
    return this.multiply([Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), pt.x - Math.cos(r) * pt.x - -Math.sin(r) * pt.y, pt.y - Math.sin(r) * pt.x - Math.cos(r) * pt.y]);
  },
  rotate: function rotate(a, b) {
    if (a instanceof js_Point) return this.rotateAboutPoint(a, b);
    var r = a * Math.PI / 180;
    return this.multiply([Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]);
  },
  normaldegree: function normaldegree(r) {
    return r < 0 ? r + 360 : r;
  },
  rotation: function rotation(norm) {
    var l = this.elements,
      r = Math.atan2(l[1], l[0]) * 180 / Math.PI;
    return norm ? this.normaldegree(r) : r;
  },
  scaling: function scaling() {
    return Math.sqrt(Math.pow(this.elements[0], 2) + Math.pow(this.elements[1], 2));
  },
  translation: function translation() {
    return new js_Point(this.elements[4], this.elements[5]);
  }
};
/* harmony default export */ var Matrix = (_Matrix);
;// ./src/js/Ancestry.js
function Ancestry_typeof(o) { "@babel/helpers - typeof"; return Ancestry_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Ancestry_typeof(o); }
function Ancestry_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Ancestry_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Ancestry_toPropertyKey(o.key), o); } }
function Ancestry_createClass(e, r, t) { return r && Ancestry_defineProperties(e.prototype, r), t && Ancestry_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Ancestry_toPropertyKey(t) { var i = Ancestry_toPrimitive(t, "string"); return "symbol" == Ancestry_typeof(i) ? i : i + ""; }
function Ancestry_toPrimitive(t, r) { if ("object" != Ancestry_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Ancestry_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Ancestry = /*#__PURE__*/function () {
  function Ancestry(self) {
    Ancestry_classCallCheck(this, Ancestry);
    this.Items = [];
    this._add(self, self.element);
    this.Self = self;
    this._init();
  }
  return Ancestry_createClass(Ancestry, [{
    key: "_getScroll",
    value: function _getScroll() {
      return new js_Point(window.pageXOffset || document.documentElement.scrollLeft, window.pageYOffset || document.documentElement.scrollTop);
    }

    /**
     * Gets size/positions from computed style
     * @param {HtmlElement} el
     * @param {CSSStyleDeclaration} cs If you just got the computed styles, pass them in.
     */
  }, {
    key: "GetElementSize",
    value: function GetElementSize(el, cs) {
      cs = cs || getComputedStyle(el);
      var left = parseFloat(cs.left);
      var top = parseFloat(cs.top);
      var w = parseFloat(cs.width);
      var h = parseFloat(cs.height);
      return {
        offset: new js_Point(left || 0, top || 0),
        width: w,
        height: h,
        topleft: new js_Point(0, 0),
        topright: new js_Point(w, 0),
        bottomright: new js_Point(w, h),
        bottomleft: new js_Point(0, h)
      };
    }

    /**
     * Prints out the Ancestry to console
     */
  }, {
    key: "_debug",
    value: function _debug() {
      this.Items.forEach(function (v, i) {
        console.log(v.matrix.elements);
      });
      this.Items.forEach(function (v, i) {
        console.log([v.element]);
      });
    }

    /**
     * Automatically called after resizing the window.
     * Or can be called manually if the resizable element has its position on 
     * the page changed by elements outside its Ancestry. E.g. content above, changes height
     */
  }, {
    key: "Refresh",
    value: function Refresh() {
      this.Items = [];
      this._add(this.Self, this.Self.element);
      //this.scroll = Point.Point0;
      this._init();
    }

    /**
     * Checks a computed style value to see if it is in percent instead of px 
     * @param {String|Number} v
     */
  }, {
    key: "_ispercent",
    value: function _ispercent(v) {
      return v.indexOf('%') > -1;
    }

    /**
     * Checks a computed style value to see if it is auto
     * @param {String|Number} v
     */
  }, {
    key: "_isauto",
    value: function _isauto(v) {
      return v == 'auto';
    }

    /**
     * Converts percentage values obtained from buggy browsers to pixels
     * @param {String} k CSS style to calculate
     * @param {String|Number} val The percentage value to convert to pixels
     * @param {CSSStyleDeclaration} cs The computed styles of the parent element. E.g. getComputedStyle(parentElement);
     */
  }, {
    key: "_pixelFromParent",
    value: function _pixelFromParent(k, val, cs) {
      if (val === '0%') return 0;
      var v = parseFloat(val);
      switch (k) {
        case 'left':
          v = parseFloat(cs.width) * v / 100;
          break;
        case 'top':
          v = parseFloat(cs.height) * v / 100;
          break;
      }
      return v;
    }

    /**
     * Gets dimensions from computed styles and makes them all pixel based
     * @param {HtmlElement} el
     */
  }, {
    key: "GetComputedDims",
    value: function GetComputedDims(el) {
      var cs = getComputedStyle(el);
      var cmt = cs.marginTop;
      var cml = cs.marginLeft;
      var cl = cs.left;
      var ct = cs.top;
      var leftp = this._ispercent(cl);
      var topp = this._ispercent(ct);
      var pf = function pf(v) {
        return parseFloat(v);
      };
      var l, t, pcs;
      if (this._isauto(cl)) cl = 0;
      if (this._isauto(ct)) ct = 0;
      if (leftp || topp) pcs = getComputedStyle(el.parentNode);
      if (leftp) l = this._pixelFromParent('left', cl, pcs);
      if (topp) t = this._pixelFromParent('top', ct, pcs);
      ;
      return {
        left: typeof l != 'undefined' ? l : pf(cl),
        top: typeof t != 'undefined' ? t : pf(ct),
        marginLeft: pf(cml),
        marginTop: pf(cmt),
        transform: cs.transform
      };
    }

    /**
     * Walks upwards through node hierarchy replacing any position/offset changing CSS with an equivalent matrix.
     * This simplifies matrix calculations and means no CSS restrictions are required on elements you want to make transformable.
     */
  }, {
    key: "_init",
    value: function _init() {
      var t,
        has,
        pt,
        tid,
        nm,
        el = this.Self.element;
      while (el.parentNode && !el.parentNode.body) {
        var cs = this.GetComputedDims(el.parentNode);
        t = cs.transform;
        has = /matrix\(\-?[0-9]+[^\)]+\)/.test(t);
        var top = cs.top;
        var left = cs.left,
          margintop = cs.marginTop,
          marginleft = cs.marginLeft;
        if (has || el.parentNode.classList.contains('transformable') || el.classList.contains('transformable') || top != 0 || left != 0 || margintop != 0 || marginleft != 0) {
          if (tid = el.parentNode.getAttribute('data-transformable-id')) {
            pt = Transformable.Instance[tid];
            if (pt) this._add(pt);
          } else {
            var om = has ? new Matrix(this.Self._cssStringToArray(t)) : false;
            if (has || top != 0 || left != 0 || margintop != 0 || marginleft != 0 || el.classList.contains('transformable')) {
              nm = new Matrix();
              nm.translate(left || 0, top || 0).translate(marginleft || 0, margintop || 0);
              if (om) nm.multiply(om.elements);
              var prect = this.GetElementSize(el.parentNode);
              el.parentNode.style.top = 0;
              el.parentNode.style.left = 0;
              el.parentNode.style.marginLeft = 0;
              el.parentNode.style.marginTop = 0;
              el.parentNode.style.transformOrigin = '0 0';
              el.parentNode.style.transform = this.Self._arrayToCssString(nm.elements);
              this._add(nm, el.parentNode, prect);
            }
          }
        }
        el = el.parentNode;
      }
    }

    /**
     * Sets offset initially then updates scroll position data
     */
  }, {
    key: "_setoffset",
    value: function _setoffset() {
      this.scroll = this._getScroll();
      if (this.offset) return;
      var cur, i;
      var trans = new Matrix();
      for (i = 0; i < this.Items.length; i++) trans.translate(this.Items[i].matrix.translation());
      for (i = 0; i < this.Items.length; i++) {
        cur = this.Items[i];
        if (cur.element.classList.contains('transformable')) {
          this.offset = cur.transformable.offset.sub(trans.translation());
          break;
        }
      }
    }

    /**
     * Adds an element/transformable element to the Ancestry of parent elements
     * @param {Transformable|Matrix} t
     * @param {HtmlElement} el
     */
  }, {
    key: "_add",
    value: function _add(t, el) {
      if (t instanceof Transformable) {
        this.Items.unshift({
          matrix: t.matrix,
          element: el || t.element,
          rect: t.sizes.element.initial,
          transformable: t
        });
      }
      if (t instanceof Matrix) {
        this.Items.unshift({
          matrix: t,
          element: el,
          rect: this.GetElementSize(el)
        });
      }
    }

    /**
     * Returns Array of objects for each parent element.
     * Gets the matrix, inverse matrix and the element for each parent.
     */
  }, {
    key: "GetParents",
    value: function GetParents() {
      var r = [];
      //this._setoffset();
      this.Items.forEach(function (v, i) {
        var t = v.transformable,
          m,
          ti;
        if (!t) if (ti = v.element.getAttribute('data-transformable-id')) {
          t = Transformable.Instance[ti];
          v.transformable = t;
        }
        m = t ? t.matrix : v.matrix;
        r.push({
          Matrix: m,
          Inverse: m.inverse(),
          Element: v.element
        });
      });
      return r;
    }

    /**
     * Uses this instance's matrix to transform corner points
     * @param {Object} c Named points of a rectangle
     */
  }, {
    key: "TransformCorners",
    value: function TransformCorners(c) {
      var mat = this.GetMatrix();
      return {
        bottomright: mat.transformpoint(c.bottomright),
        bottomleft: mat.transformpoint(c.bottomleft),
        topright: mat.transformpoint(c.topright),
        topleft: mat.transformpoint(c.topleft)
      };
    }

    /**
     * Gets data from Items for the outermost containing element.
     */
  }, {
    key: "FirstParent",
    value: function FirstParent() {
      var t = this,
        i = t.Items,
        l = i.length;
      var par = l > 1 ? i[l - 2] : false;
      return par;
    }

    /**
     Gets the combined effective matrix based on all matrices that have an effect on the element
     */
  }, {
    key: "GetMatrix",
    value: function GetMatrix() {
      var mat = Matrix.Identity();
      this.Items.forEach(function (v, i) {
        mat.multiply(v.matrix.elements);
      });
      return mat;
    }

    /**
     * Gets the x,y coordinate on the transformable element for a given point
     * @param {Point} p Coordinates in the window or from a mouse/touch event
     * @param {Array of Object} pars Objects with matrix, inverse matrix and element
     */
  }, {
    key: "OffsetFromPoint",
    value: function OffsetFromPoint(p, pars) {
      pars = pars || this.GetParents();
      this._setoffset();
      var op = p,
        cur,
        mat = Matrix.Identity().translate(this.offset);
      for (var i = 0; i < pars.length; i++) {
        cur = pars[i];
        mat.multiply(cur.Matrix.elements);
      }
      var matinv = mat.inverse();
      op = matinv.transformpoint(op);
      return op;
    }
  }]);
}();
/* harmony default export */ var js_Ancestry = (Ancestry);
;// ./src/js/transformable.js
function transformable_typeof(o) { "@babel/helpers - typeof"; return transformable_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, transformable_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function transformable_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function transformable_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, transformable_toPropertyKey(o.key), o); } }
function transformable_createClass(e, r, t) { return r && transformable_defineProperties(e.prototype, r), t && transformable_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = transformable_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function transformable_toPropertyKey(t) { var i = transformable_toPrimitive(t, "string"); return "symbol" == transformable_typeof(i) ? i : i + ""; }
function transformable_toPrimitive(t, r) { if ("object" != transformable_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != transformable_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





// Wheel event polyfill (modernized slightly for scope, but logic preserved for compatibility)
(function (window, document) {
  var prefix = "";
  var _addEventListener;

  // Detect event model
  if (window.addEventListener) {
    _addEventListener = "addEventListener";
  } else {
    _addEventListener = "attachEvent";
    prefix = "on";
  }

  // Detect available wheel event
  var support = "onwheel" in document.createElement("div") ? "wheel" :
  // Modern browsers
  document.onmousewheel !== undefined ? "mousewheel" :
  // Webkit and IE
  "DOMMouseScroll"; // Older Firefox

  window.addWheelListener = function (elem, callback, useCapture) {
    var _addWheelListener = function _addWheelListener(targetElem, eventName, cb, capture) {
      targetElem[_addEventListener](prefix + eventName, support === "wheel" ? cb : function (originalEvent) {
        var event = originalEvent || window.event;

        // Create a normalized event object
        var normalizedEvent = {
          originalEvent: event,
          target: event.target || event.srcElement,
          type: "wheel",
          deltaMode: event.type === "MozMousePixelScroll" ? 0 : 1,
          deltaX: 0,
          deltaY: 0,
          deltaZ: 0,
          preventDefault: function preventDefault() {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
          },
          stopPropagation: function stopPropagation() {
            event.stopPropagation ? event.stopPropagation() : event.returnValue = false;
          }
        };

        // Calculate deltaY (and deltaX)
        if (support === "mousewheel") {
          normalizedEvent.deltaY = -1 / 40 * event.wheelDelta;
          if (event.wheelDeltaX) {
            normalizedEvent.deltaX = -1 / 40 * event.wheelDeltaX;
          }
        } else {
          normalizedEvent.deltaY = event.detail;
        }
        return cb(normalizedEvent);
      }, capture || false);
    };
    _addWheelListener(elem, support, callback, useCapture);

    // Handle MozMousePixelScroll in older Firefox
    if (support === "DOMMouseScroll") {
      _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
    }
  };
})(window, document);
var transformable_Transformable = /*#__PURE__*/function () {
  /**
   * Constructor
   * @param {HTMLElement} el
   * @param {Object} opts
   */
  function Transformable(el) {
    var _opts$attachevents;
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    transformable_classCallCheck(this, Transformable);
    this.element = el.length ? el[0] : el;
    this.options = opts;
    this.element.classList.add('transformable');
    this.parent = this.element.parentNode;
    this.setInitialSizes();
    if (opts.matrix) {
      var _opts$computedsize, _opts$computedsize2;
      var cscale = {
        x: 1,
        y: 1
      };
      if ((_opts$computedsize = opts.computedsize) !== null && _opts$computedsize !== void 0 && _opts$computedsize.width || (_opts$computedsize2 = opts.computedsize) !== null && _opts$computedsize2 !== void 0 && _opts$computedsize2.Width) {
        var precs = {
          width: opts.computedsize.width || opts.computedsize.Width,
          height: opts.computedsize.height || opts.computedsize.Height
        };
        var curcs = this.sizes.element.initial;
        cscale.x = curcs.width / precs.width;
        cscale.y = curcs.height / precs.height;
      }
      if (Array.isArray(opts.matrix) && opts.matrix.length === 6) {
        opts.matrix[4] *= cscale.x;
        opts.matrix[5] *= cscale.y;
        this._setMatrix(new Matrix(opts.matrix));
      } else if (opts.matrix instanceof Matrix) {
        opts.matrix.elements[4] *= cscale.x;
        opts.matrix.elements[5] *= cscale.y;
        this._setMatrix(opts.matrix);
      }
    }
    this.matrix = this._getMatrix();
    this.originalTransition = this._getOriginalTransition();
    this.Ancestry = new js_Ancestry(this);
    this._setOffset();
    this.Ancestry._setoffset();
    this.dragging = false;
    this.start = null;
    this.orig = null;
    this.zooma = 0.001;
    this.events = {
      start: opts.start,
      move: opts.move,
      stop: opts.stop,
      tap: opts.tap,
      transition: opts.transition
    };
    this.element.setAttribute('data-transformable-id', Transformable.Instance.push(this) - 1);
    if (!navigator.userAgent.includes('Edge')) {
      this.element.setAttribute('draggable', 'false');
    }
    if (((_opts$attachevents = opts.attachevents) !== null && _opts$attachevents !== void 0 ? _opts$attachevents : true) && opts.editable !== false) {
      var _opts$disable;
      this._addEvents();
      if (opts.resize) this.createResizeHandles(opts.resize);
      if (!((_opts$disable = opts.disable) !== null && _opts$disable !== void 0 && _opts$disable.rotate)) this.createRotateHandles();
      if (opts.handle && opts.type === 'rotator-box') this._addRotateEvents(opts.handle);
    }
  }

  /**
   * Gets any existing CSS transition that exists on the element.
   * It will be merged with transition changes to preserve existing effects
   */
  return transformable_createClass(Transformable, [{
    key: "_getOriginalTransition",
    value: function _getOriginalTransition() {
      var t = getComputedStyle(this.element).transition;
      if (!t) return '';
      return t.split(',').filter(function (part) {
        return !part.trim().startsWith('transform');
      }).join(',');
    }

    /**
     * Creates an HTML Element from a string.
     * @param {String} str E.g. span, div etc
     */
  }, {
    key: "tag",
    value: function tag(str) {
      var r = document.createElement('div');
      r.innerHTML = str;
      return r.firstChild;
    }

    /**
     * Adds rotation handles on to the transformable element and wires up their events
     * @param {String} typ 
     */
  }, {
    key: "createRotateHandles",
    value: function createRotateHandles(typ) {
      var _this = this;
      if (typ && typ !== 'rotate') return;
      var box = this.tag('<div class="transformable-rotation-box"></div>');
      var rot = this.tag('<svg class="transformable-svg-rotator" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve"><g><circle style="fill:#00A8DF;" cx="48.3" cy="48" r="35.3"/><g><path style="fill:#FFFFFF;" d="M35.2,3.8l4.1,28.5c0.2,1.5,2,2.1,3,1l8.2-8.2c0.7-0.7,1.8-0.7,2.5,0l8.8,8.8c7.8,7.8,9.1,20.2,1.2,28.2l-10,10c-0.7,0.7-1.8,0.7-2.5,0L41,62.6c-1-1-2.8-0.4-3,1l-4.1,28.5c-0.2,1.2,0.8,2.2,2,2l28.5-4.1c1.5-0.2,2.1-2,1-3l-8.9-8.9c-0.7-0.7-0.7-1.8,0-2.5l10-10c9.8-9.8,8.5-25.6-1.2-35.2l-8.8-8.8c-0.7-0.7-0.7-1.8,0-2.5L66.7,8.9c1-1,0.4-2.8-1-3L37.2,1.8C36,1.6,35,2.6,35.2,3.8z"/><g style="opacity:0.5;"><path d="M36.9,1.8c0.1,0,0.2,0,0.3,0l28.5,4.1c1.5,0.2,2.1,2,1,3L56.6,19.1c-0.7,0.7-0.7,1.8,0,2.5l8.8,8.8c9.7,9.7,11,25.5,1.2,35.2l-10,10c-0.7,0.7-0.7,1.8,0,2.5l8.9,8.9c1,1,0.4,2.8-1,3l-28.5,4.1c-0.1,0-0.2,0-0.3,0c-1.1,0-1.9-1-1.8-2.1l4.1-28.5c0.1-1,0.9-1.5,1.8-1.5c0.4,0,0.9,0.2,1.3,0.5l9.5,9.5c0.4,0.4,0.8,0.5,1.3,0.5s0.9-0.2,1.3-0.5l10-10c8-8,6.7-20.3-1.2-28.2L53,25.2c-0.4-0.4-0.8-0.5-1.3-0.5s-0.9,0.2-1.3,0.5l-8.2,8.2c-0.4,0.4-0.8,0.5-1.3,0.5c-0.8,0-1.7-0.6-1.8-1.5L35.2,3.8C35,2.7,35.9,1.8,36.9,1.8 M36.9-0.2c-1.1,0-2.1,0.5-2.9,1.3c-0.7,0.8-1,1.9-0.9,3l4.1,28.5c0.3,1.9,1.9,3.3,3.8,3.3c1,0,2-0.4,2.7-1.1l8.1-8.1l8.7,8.7c7.4,7.4,8,18.6,1.2,25.3l-9.8,9.8l-9.3-9.3c-0.7-0.7-1.7-1.1-2.7-1.1c-1.9,0-3.5,1.4-3.8,3.3l-4.1,28.5c-0.2,1.1,0.2,2.2,0.9,3c0.7,0.8,1.8,1.3,2.9,1.3c0.2,0,0.4,0,0.5,0l28.5-4.1c1.4-0.2,2.6-1.2,3.1-2.6c0.5-1.4,0.1-2.9-0.9-3.9l-8.7-8.7l9.8-9.8c10.2-10.2,9.6-27.2-1.2-38.1l-8.7-8.7l10-10c1-1,1.4-2.5,0.9-3.9c-0.5-1.4-1.6-2.4-3.1-2.6L37.5-0.2C37.3-0.2,37.1-0.2,36.9-0.2L36.9-0.2z"/></g></g></g></svg>');
      var anc = this.tag('<svg class="transformable-svg-anchor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve"><g><circle style="fill:#00A8DF;" cx="47.6" cy="48.4" r="17.6"/><g><path style="fill:#FFFFFF;" d="M69,46H50V27.2c0-1.4-1.1-2.4-2.5-2.4S45,25.9,45,27.2V46H26.6c-1.4,0-2.4,1.1-2.4,2.5s1.1,2.5,2.4,2.5H45v18.6c0,1.4,1.1,2.4,2.5,2.4s2.5-1.1,2.5-2.4V51h19c1.4,0,2.4-1.1,2.4-2.5S70.3,46,69,46z"/><g style="opacity:0.5;"><path d="M47.5,24.8c1.4,0,2.5,1.1,2.5,2.4V46h19c1.4,0,2.4,1.1,2.4,2.5c0,1.4-1.1,2.5-2.4,2.5H50v18.6c0,1.4-1.1,2.4-2.5,2.4S45,70.9,45,69.6V51H26.6c-1.4,0-2.4-1.1-2.4-2.5c0-1.4,1.1-2.5,2.4-2.5H45V27.2C45,25.9,46.1,24.8,47.5,24.8 M47.5,22.8c-2.5,0-4.5,2-4.5,4.4V44H26.6c-2.5,0-4.4,2-4.4,4.5c0,2.5,2,4.5,4.4,4.5H43v16.6c0,2.5,2,4.4,4.5,4.4s4.5-2,4.5-4.4V53h17c2.5,0,4.4-2,4.4-4.5c0-2.5-2-4.5-4.4-4.5H52V27.2C52,24.8,50,22.8,47.5,22.8L47.5,22.8z"/></g></g></g></svg>');
      var lin = this.tag('<div class="transformable-rotation-line"></div>');
      box.append(lin, anc, rot, this.tag('<div class="transformable-anchor-point"></div>'));
      if (this.element.nodeName === 'IMG') {
        this.parent.appendChild(box);
      } else {
        this.element.appendChild(box);
      }
      box.addEventListener('click', function (e) {
        e.stopPropagation();
        return false;
      });
      this.rotatorBox = new Transformable(box, {
        type: 'rotator-box',
        rotatetarget: this,
        handle: rot,
        disable: {
          zoom: true,
          rotate: true,
          resize: true
        }
      });
      var _domouseup = function _domouseup() {
        var _this$rotatorBox;
        if ((_this$rotatorBox = _this.rotatorBox) !== null && _this$rotatorBox !== void 0 && _this$rotatorBox.parent) {
          _this.rotatorBox.parent.classList.remove('transformable-mousedown');
        }
        _this.off(document.body, 'mouseup.rotatormouse');
      };
      var _domousedown = function _domousedown() {
        _this.rotatorBox.parent.classList.add('transformable-mousedown');
        _this.on(document.body, 'mouseup.rotatormouse', _domouseup);
      };
      var _domouseleave = function _domouseleave(e) {
        if (_this._overTimer) clearTimeout(_this._overTimer);
        _this._resizeTimer = setTimeout(function () {
          _this.element.classList.remove('transformable-resize-over');
        }, 500);
        e.currentTarget.classList.remove('transformable-over-active', 'transformable-over');
      };
      var _domouseenter = function _domouseenter(tim) {
        if (tim.stopPropagation) tim.stopPropagation();
        if (_this._resizeTimer) clearTimeout(_this._resizeTimer);
        var target = _this.rotatorBox.parent;
        target.classList.add('transformable-over', 'transformable-resize-over');
        _this.Ancestry.Items.forEach(function (v) {
          if (v._overTimer) clearTimeout(v._overTimer);
        });
        _this._overTimer = setTimeout(function () {
          var rb = _this.rotatorBox;
          if (parseFloat(getComputedStyle(rb.element).width) >= 32) {
            rb.parent.classList.add('transformable-over-active');
          }
          var l = _this.Ancestry.Items.length;
          _this.Ancestry.Items.forEach(function (v, i) {
            if (i < l - 2) {
              v.element.classList.remove('transformable-over-active');
            }
          });
        }, typeof tim === 'number' ? tim : 1500);
      };
      var rotparent = this.rotatorBox.parent;
      this.on(rotparent, 'mouseenter.rotatormouse', _domouseenter);
      this.on(rotparent, 'mouseleave.rotatormouse', _domouseleave);
      this.on(rotparent, 'mousedown.rotatormouse', _domousedown);
      this.on(rotparent, 'click.rotatormouse', function () {
        return _domouseenter.call(rotparent, 0);
      });
    }

    /**
     * Creates resize handles on the transformable element and wires up their events
     * @param {String} typ
     */
  }, {
    key: "createResizeHandles",
    value: function createResizeHandles(typ) {
      if (typ !== 'tl-br') return;
      var tl_svg = this.tag('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-271 394.9 52 52" style="enable-background:new -271 394.9 52 52;" xml:space="preserve"><g><path style="fill:#00A8DF;" d="M-244.9,421L-244.9,421L-244.9,421L-244.9,421L-244.9,421l26,0.1c0-10.8-6.1-20-16-24.1 c-10-4.1-20.8-2-28.4,5.7c-7.6,7.6-9.7,18.5-5.6,28.4c4.2,10,13.4,16,24.2,15.9L-244.9,421z"/><path style="fill:none;stroke:#FFFFFF;stroke-width:3;" d="M-251.6,414.3"/><path style="fill:none;stroke:#FFFFFF;stroke-width:3;" d="M-236.6,414.3"/></g><g><path style="fill:#FFFFFF;" d="M-227,419.5l-7.6-4.4c-1.1-0.6-2.4,0.2-2.4,1.4v1.9h-5.6v-5.5h2c1.2,0,2-1.3,1.4-2.4l-4.4-7.6 c-0.6-1.1-2.1-1.1-2.7,0l-4.4,7.6c-0.6,1.1,0.2,2.4,1.4,2.4h2v5.5h-5.6v-1.9c0-1.2-1.3-2-2.4-1.4l-7.6,4.4c-1.1,0.6-1.1,2.1,0,2.7 l7.6,4.4c1.1,0.6,2.4-0.2,2.4-1.4v-2h5.6v5.6h-2c-1.2,0-2,1.3-1.4,2.4l4.4,7.6c0.6,1.1,2.1,1.1,2.7,0l4.4-7.6 c0.6-1.1-0.2-2.4-1.4-2.4h-2v-5.6h5.6v2c0,1.2,1.3,2,2.4,1.4l7.6-4.4C-225.9,421.7-225.9,420.1-227,419.5z"/><path style="opacity:0.5;fill:#231F20;" d="M-245,402.1c0.5,0,1.1,0.3,1.4,0.8l4.4,7.6c0.6,1.1-0.2,2.4-1.4,2.4h-2v5.5h5.6v-1.9 c0-0.9,0.8-1.6,1.6-1.6c0.3,0,0.5,0.1,0.8,0.2l7.6,4.4c1.1,0.6,1.1,2.1,0,2.7l-7.6,4.4c-0.3,0.1-0.5,0.2-0.8,0.2 c-0.8,0-1.6-0.7-1.6-1.6v-2h-5.6v5.6h2c1.2,0,2,1.3,1.4,2.4l-4.4,7.6c-0.3,0.5-0.8,0.8-1.4,0.8c-0.5,0-1.1-0.3-1.4-0.8l-4.4-7.6 c-0.6-1.1,0.2-2.4,1.4-2.4h2v-5.6h-5.6v2c0,0.9-0.8,1.6-1.6,1.6c-0.3,0-0.5-0.1-0.8-0.2l-7.6-4.4c-1.1-0.6-1.1-2.1,0-2.7l7.6-4.4 c0.3-0.1,0.5-0.2,0.8-0.2c0.8,0,1.6,0.7,1.6,1.6v1.9h5.6v-5.5h-2c-1.2,0-2-1.3-1.4-2.4l4.4-7.6C-246.1,402.3-245.5,402.1-245,402.1 M-245,400.6c-1.1,0-2.1,0.6-2.6,1.5l-4.4,7.6c-0.5,0.9-0.5,2.1,0,3c0.5,0.9,1.5,1.5,2.6,1.5h0.5v2.7h-2.7v-0.5c0-1.7-1.4-3-3-3 c-0.5,0-1,0.1-1.5,0.4l-7.6,4.4c-0.9,0.5-1.5,1.5-1.5,2.6c0,1.1,0.6,2.1,1.5,2.6l7.6,4.4c0.5,0.3,1,0.4,1.5,0.4c1.7,0,3-1.4,3-3	v-0.6h2.7v2.8h-0.5c-1.1,0-2.1,0.6-2.6,1.5c-0.5,0.9-0.5,2.1,0,3l4.4,7.6c0.5,0.9,1.5,1.5,2.6,1.5c1.1,0,2.1-0.6,2.6-1.5l4.4-7.6 c0.5-0.9,0.5-2.1,0-3c-0.5-0.9-1.5-1.5-2.6-1.5h-0.5v-2.8h2.7v0.6c0,1.7,1.4,3,3,3c0.5,0,1-0.1,1.5-0.4l7.6-4.4	c0.9-0.5,1.5-1.5,1.5-2.6c0-1.1-0.6-2.1-1.5-2.6l-7.6-4.4c-0.5-0.3-1-0.4-1.5-0.4c-1.7,0-3,1.4-3,3v0.5h-2.7v-2.7h0.5	c1.1,0,2.1-0.6,2.6-1.5c0.5-0.9,0.5-2.1,0-3l-4.4-7.6C-242.9,401.2-243.9,400.6-245,400.6L-245,400.6z"/></g></svg>');
      var br_svg = this.tag('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-271 394.9 52 52" style="enable-background:new -271 394.9 52 52;" xml:space="preserve"><g><path style="fill:#00A8DF;" d="M-245,420.9L-245,420.9L-245,420.9L-245,420.9L-245,420.9l-26-0.1c0,10.8,6.1,20,16,24.1 c10,4.1,20.8,2,28.4-5.7c7.6-7.6,9.7-18.5,5.6-28.4c-4.2-10-13.4-16-24.2-15.9L-245,420.9z"/></g><g><path style="fill:#FFFFFF;" d="M-245.8,423l-2.5-2.5l-2.1,2.1c-0.9,0.9-2.3,0.5-2.6-0.7l-1.6-9.2c-0.3-1.2,0.8-2.3,1.9-1.9l9.2,1.6 c1.2,0.3,1.6,1.8,0.7,2.6l-2.1,2.1l2.5,2.5l2.7,2.7l-1-1l2.1-2.1c0.9-0.9,2.3-0.5,2.6,0.7l1.6,9.2c0.3,1.2-0.8,2.3-1.9,1.9 l-9.2-1.6c-1.2-0.3-1.6-1.8-0.7-2.6l2.1-2.1l-3.2-3.2L-245.8,423z"/><path style="opacity:0.5;fill:#231F20;" d="M-239.6,422.3l-1-1l2.1-2.1c0.7-0.7,1.7-0.6,2.2,0c0.2,0.2,0.3,0.4,0.4,0.7l1.6,9.2 c0.3,1.2-0.8,2.3-1.9,1.9l-9.2-1.6c-0.3-0.1-0.5-0.2-0.7-0.4c-0.6-0.6-0.7-1.6,0-2.2l2.1-2.1l-3.2-3.2l1.5,1.5l-2.5-2.5l-2.1,2.1 c-0.7,0.7-1.7,0.6-2.2,0c-0.2-0.2-0.3-0.4-0.4-0.7l-1.6-9.2c-0.3-1.2,0.8-2.3,1.9-1.9l9.2,1.6c0.3,0.1,0.5,0.2,0.7,0.4 c0.6,0.6,0.7,1.6,0,2.2l-2.1,2.1l2.5,2.5L-239.6,422.3z M-242.3,417.5l-0.5-0.5l1-1c1.2-1.2,1.2-3.1,0-4.3 c-0.4-0.4-0.8-0.6-1.4-0.8l-9.2-1.6c-1.1-0.3-2.1,0-2.9,0.8c-0.8,0.8-1.1,1.9-0.8,2.9l1.6,9.2c0.1,0.5,0.4,1,0.8,1.4 c1.2,1.2,3.1,1.2,4.3,0l1.1-1.1l0.5,0.5l0.5,0.5l1.2,1.2l-1.1,1.1c-1.2,1.2-1.2,3.1,0,4.3c0.4,0.4,0.8,0.6,1.4,0.8l9.2,1.6 c1.1,0.3,2.1,0,2.9-0.8c0.8-0.8,1.1-1.9,0.8-2.9l-1.6-9.2c-0.1-0.5-0.4-1-0.8-1.4c-1.2-1.2-3.1-1.2-4.3,0l-1,1l-1.2-1.2"/></g></svg>');
      var tlb = this.tag('<div class="transformable-resize-button"></div>');
      var brb = tlb.cloneNode();
      tlb.classList.add('tl');
      tlb.appendChild(tl_svg);
      brb.classList.add('br');
      brb.appendChild(br_svg);
      this.resizertl = tlb;
      this.resizerbr = brb;
      this.element.appendChild(tlb);
      this.element.appendChild(brb);
      this._addResizeEvents(tlb, brb);
    }

    /**
     * Zooms the element centred on the middle of the parent element in increments of 5%.
     * @param {Number} dir positive numbers make it bigger, negative make it smaller
     */
  }, {
    key: "zoom",
    value: function zoom(dir) {
      var offset = this.Ancestry.OffsetFromPoint(this._findCentreInWindow());
      this.scale(offset, 1 + dir * 0.05);
      return this;
    }

    /**
     * Scales the transformable element at point p by s amount
     * @param {Point} p Origin for the transform on the element
     * @param {any} s scale amount
     */
  }, {
    key: "scale",
    value: function scale(p, s) {
      this.matrix.scale(p, s);
      this.setTransition(true);
      this._updateElement();
      return this;
    }

    /**
     * Translates the element by x and y. Uses element pixels before any transform. Not window/screen pixels.
     * @param {Number} x Pixels horizontal
     * @param {Number} y Pixels vertical
     * @param {Boolean} transition Use a transition
     */
  }, {
    key: "translate",
    value: function translate(x, y, transition) {
      this.matrix.translate(x, y);
      this.setTransition(transition);
      this._updateElement();
      return this;
    }

    /**
     * Rotates the element about point p. Or about the centre of the element if p is not supplied. 
     * If inwindow==true, you can supply a Point in the window coordinate space and have the element rotate about that.
     * @param {Point} p The origin of the rotation in pixels on the element. When inwindow == false or undefined
     * @param {Number} a Angle in degrees
     * @param {Boolean} trans Optional: Specify if a transition should be used
     * @param {Boolean} inwindow Optional: If true, p should be treated like a window coordinate. 
     */
  }, {
    key: "rotate",
    value: function rotate(p, a, trans, inwindow) {
      var rotationPoint = p;
      if (!(rotationPoint instanceof js_Point) || !rotationPoint) {
        rotationPoint = this.Ancestry.OffsetFromPoint(this._findCentreInWindow());
      }
      if (rotationPoint instanceof js_Point && inwindow) {
        rotationPoint = this.Ancestry.OffsetFromPoint(rotationPoint);
      }
      this.matrix.rotate(rotationPoint, a);
      this.lastrotationpoint = rotationPoint;
      if (typeof trans === 'undefined' || trans === false) {
        this.setTransition(false);
      }
      this._updateElement();
      return this;
    }

    /**
     * Makes a rotated element horizontal.
     */
  }, {
    key: "straighten",
    value: function straighten() {
      var r = this.matrix.rotation();
      this.rotate(new js_Point(this.sizes.element.initial.width / 2, this.sizes.element.initial.height / 2), -r, true);
      return this;
    }

    /**
     * Scales the element to make the element's height or width match that of the parent element. Centres it and straightens out any rotation. 
     */
  }, {
    key: "fittoparent",
    value: function fittoparent() {
      var sz = new js_Point(this.sizes.element.initial.width, this.sizes.element.initial.height);
      var anc = this.Ancestry;
      var pars = anc.GetParents();
      var parentT = anc.FirstParent();
      var pr = parentT.rect;
      var m = this.matrix.inverse();
      var tl = m.transformpoint(pr.topleft);
      var tr = m.transformpoint(pr.topright);
      var bl = m.transformpoint(pr.bottomleft);
      var psiz = new js_Point(this._distanceBetweenPoints(tl, tr), this._distanceBetweenPoints(tl, bl));
      var sc = psiz.divide(sz);
      var scale = Math.min(sc.x, sc.y);
      this.scale(new js_Point(0, 0), scale);
      this.centreinparent(true, pars);
      this.straighten();
      return this;
    }

    /**
     * Scales the element so its width and height is equal or greater than the parent element. 
     * Basically so you can't see any background in the parent element. Also centres and straightens it.
     */
  }, {
    key: "filltoparent",
    value: function filltoparent() {
      var sz = new js_Point(this.sizes.element.initial.width, this.sizes.element.initial.height);
      var anc = this.Ancestry;
      var pars = anc.GetParents();
      var parentT = anc.FirstParent();
      var pr = parentT.rect;
      var m = this.matrix.inverse();
      var tl = m.transformpoint(pr.topleft);
      var tr = m.transformpoint(pr.topright);
      var bl = m.transformpoint(pr.bottomleft);
      var psiz = new js_Point(this._distanceBetweenPoints(tl, tr), this._distanceBetweenPoints(tl, bl));
      var sc = psiz.divide(sz);
      var scale = Math.max(sc.x, sc.y);
      this.scale(new js_Point(0, 0), scale);
      this.centreinparent(true, pars);
      this.straighten();
      return this;
    }

    /**
     * Gets the boundingClientRect for supplied element.
     * @param {HTMLElement} el
     */
  }, {
    key: "_getRect",
    value: function _getRect(el) {
      return el.getBoundingClientRect();
    }

    /**
     * Resets the transformation to its starting value. Undoing all changes since instantiation.
     * @param {Boolean} trans Specify if a transition should be used
     */
  }, {
    key: "reset",
    value: function reset(trans) {
      var _this2 = this;
      if (!this.InitialMatrix) {
        this.matrix.reset();
      } else {
        this.matrix.elements = _toConsumableArray(this.InitialMatrix);
      }
      this.setTransition(trans !== null && trans !== void 0 ? trans : true);
      if (this.transition) {
        var _this$delta, _this$delta2;
        if ((_this$delta = this.delta) !== null && _this$delta !== void 0 && _this$delta.x || (_this$delta2 = this.delta) !== null && _this$delta2 !== void 0 && _this$delta2.y) {
          // has moved so will transition
          this.element.classList.add('transformable-reset');
          this.on(this.element, 'transitionend.reset', function () {
            _this2.element.classList.remove('transformable-reset');
            _this2.off(_this2.element, 'transitionend.reset');
          });
        }
      }
      this._updateElement();
      return this;
    }

    /**
     * Returns true if the undo stack contains a saved state named k
     * @param {String} k
     */
  }, {
    key: "hasHistoryKey",
    value: function hasHistoryKey(k) {
      return Array.isArray(this.matrix.history.undo[k]);
    }

    /**
     * Undo the last transformation or go back to a named state.
     * @param {String} k Optional: the name of a saved state to go back to
     */
  }, {
    key: "undo",
    value: function undo(k) {
      this.matrix.undo(k);
      this.setTransition(true);
      this._updateElement();
      return this;
    }

    /**
     * Redo the last thing that was undone.
     */
  }, {
    key: "redo",
    value: function redo() {
      this.matrix.redo();
      this.setTransition(true);
      this._updateElement();
      return this;
    }

    /**
     * Sets initial sizes and positions of the element and window
     */
  }, {
    key: "setInitialSizes",
    value: function setInitialSizes() {
      if (this.sizes) return;
      var cs = window.getComputedStyle(this.element);
      var w = parseFloat(cs.width);
      var h = parseFloat(cs.height);
      var l = parseFloat(cs.left);
      var t = parseFloat(cs.top);
      this.sizes = {
        element: {
          initial: {
            offset: new js_Point(l, t),
            width: w,
            height: h,
            topleft: new js_Point(0, 0),
            topright: new js_Point(w, 0),
            bottomright: new js_Point(w, h),
            bottomleft: new js_Point(0, h)
          }
        },
        window: {
          width: parseFloat(getComputedStyle(document.body.parentNode).width)
        }
      };
    }

    /**
     * Gets the offset of an element taking in to account scroll position of the window
     * @param {HTMLElement} el Element to check
     */
  }, {
    key: "_getOffset",
    value: function _getOffset(el) {
      var cr = this._getRect(el);
      var scroll = this.Ancestry._getScroll();
      var cs = getComputedStyle(el);
      var pos = new js_Point(parseFloat(cs.left), parseFloat(cs.top));
      var os = new js_Point(cr.left + scroll.x, cr.top + scroll.y);
      var br = new js_Point(cr.right, cr.bottom);
      var tr = new js_Point(cr.right, cr.top);
      var bl = new js_Point(cr.left, cr.bottom);
      return {
        offset: os,
        topleft: os,
        bottomright: br,
        topright: tr,
        bottomleft: bl,
        pos: pos
      };
    }

    /**
     * Sets the initial offset.  
     */
  }, {
    key: "_setOffset",
    value: function _setOffset() {
      if (!this.offset) {
        var too = this._getOffset(this.element, true);
        this.offset = too.offset;
        this.initialoffset = too.offset;
      }
    }

    /**
     * Convert a string representation of a CSS transformation matrix in to an Array
     * @param {String} t The CSS transformation
     */
  }, {
    key: "_cssStringToArray",
    value: function _cssStringToArray(t) {
      var match = t.match(/[0-9e., -]+/);
      if (!match) return [];
      return match[0].split(", ").map(function (v) {
        return parseFloat(v);
      });
    }

    /**
     * Converts a 6 element Array in to a CSS transformation string.
     * @param {Array} a 
     */
  }, {
    key: "_arrayToCssString",
    value: function _arrayToCssString(a) {
      return "matrix(".concat(a.join(','), ")");
    }

    /**
     * Creates a Matrix for the transformable element. 
     * Cancels out any CSS that affects the offset or position of the element and converts to an equivalent CSS transformation matrix.
     * @param {HTMLElement} el
     */
  }, {
    key: "_getMatrix",
    value: function _getMatrix(el) {
      var elem = el || this.element;
      var cs = getComputedStyle(elem);
      var pcs = getComputedStyle(this.parent);
      var t = cs.transform,
        csTop = cs.top,
        csLeft = cs.left,
        marginTop = cs.marginTop,
        marginLeft = cs.marginLeft,
        borderTopWidth = cs.borderTopWidth,
        borderLeftWidth = cs.borderLeftWidth;
      var top = csTop.includes('%') ? parseFloat(pcs.height) * parseFloat(csTop) / 100 : parseFloat(csTop);
      var left = csLeft.includes('%') ? parseFloat(pcs.width) * parseFloat(csLeft) / 100 : parseFloat(csLeft);
      var margintop = parseFloat(marginTop);
      var marginleft = parseFloat(marginLeft);
      var bordertop = parseFloat(borderTopWidth);
      var borderleft = parseFloat(borderLeftWidth);
      var mElements;
      if (/matrix\(-?[0-9e., -]+\)/.test(t)) {
        mElements = this._cssStringToArray(t);
        if (!this.InitialMatrix) {
          this.InitialMatrix = _toConsumableArray(mElements);
        }
      }
      var m = new Matrix(mElements || [1, 0, 0, 1, 0, 0]);
      if (left || top || margintop || marginleft || bordertop || borderleft) {
        m.translate(left || 0, top || 0);
        m.translate(marginleft || 0, margintop || 0);
        m.translate(borderleft || 0, bordertop || 0);
        Object.assign(elem.style, {
          marginTop: '0px',
          marginLeft: '0px',
          top: '0px',
          left: '0px'
        });
        elem.style.marginTop = -(bordertop || 0) + 'px';
        elem.style.marginLeft = -(bordertop || 0) + 'px';
        this.matrix = m;
        this._updateElement();
        this.InitialMatrix = _toConsumableArray(m.elements);
      }
      return m;
    }

    /**
     * Sets the transition to use for transforms. 
     * Retains any existing transition originally set by CSS
     * @param {Boolean} bool If true will use a transition
     */
  }, {
    key: "setTransition",
    value: function setTransition(bool) {
      if (typeof bool !== 'boolean' || this.transition === bool) return;
      var currentSplits = this.originalTransition ? this.originalTransition.split(',') : [];
      if (bool) {
        currentSplits.push('transform 0.5s');
      } else {
        currentSplits.push('transform 0s');
      }
      this.element.style.transition = currentSplits.join(',');
      this.transition = bool;
    }

    /**
     * Sets the CSS transform on the element.
     */
  }, {
    key: "_updateElement",
    value: function _updateElement() {
      this.element.style.transform = "matrix(".concat(this.matrix.elements.join(','), ")");
    }

    /**
     * Adds the current matrix to the undo stack.
     */
  }, {
    key: "_pushhistory",
    value: function _pushhistory() {
      this.matrix.save();
    }

    /**
     * Sets the matrix property on this instance and applies the CSS.
     * @param {Matrix} m
     */
  }, {
    key: "_setMatrix",
    value: function _setMatrix(m) {
      this.matrix = m;
      this._updateElement();
    }

    /**
     * Gets the window coordinates of a mouse or touch event.
     * Also gets the angle and centre point between two touches
     * * @param {Event} e
     * @param {Array} touches
     */
  }, {
    key: "_getPageXY",
    value: function _getPageXY(e, touches) {
      var xy, ang, p1, p2;
      if (touches) {
        if (touches.length === 2) {
          xy = this._getMiddle(touches);
          ang = this._getRotation(touches);
          p1 = new js_Point(touches[0].pageX, touches[0].pageY);
          p2 = new js_Point(touches[1].pageX, touches[1].pageY);
        } else {
          xy = new js_Point(touches[0].pageX, touches[0].pageY);
          ang = this.matrix.rotation();
        }
      } else {
        xy = new js_Point(e.pageX, e.pageY);
        ang = this.matrix.rotation();
      }
      return {
        point: xy,
        angle: ang,
        p1: p1,
        p2: p2
      };
    }

    /**
     * Gets offset (point in element coordinate space), 
     * window coordinates of the event and angle, distance and centre between two touches.
     * @param {Event} e
     * @param {Array} touches
     */
  }, {
    key: "_getPoint2",
    value: function _getPoint2(e, touches) {
      var dat = this._getPageXY(e, touches);
      var anc = this.Ancestry;
      var pars = anc.GetParents();
      var op = anc.OffsetFromPoint(dat.point, pars);
      var dist = dat.p1 && dat.p2 ? this._distanceBetweenPoints(anc.OffsetFromPoint(dat.p1, pars), anc.OffsetFromPoint(dat.p2, pars)) : 0;
      var deltaXY = null;
      if (typeof e.deltaX !== 'undefined') {
        deltaXY = new js_Point(e.deltaX, e.deltaY);
      }
      return {
        offset: op,
        pageXY: dat.point,
        pageX: dat.point.x,
        pageY: dat.point.y,
        angle: dat.angle,
        distance: dist,
        deltaXY: deltaXY
      };
    }

    /**
     * Calculates the distance between two points
     * @param {Point} a First point
     * @param {Point} b Second point
     */
  }, {
    key: "_distanceBetweenPoints",
    value: function _distanceBetweenPoints(a, b) {
      var prop = a.pageX ? {
        x: 'pageX',
        y: 'pageY'
      } : {
        x: 'x',
        y: 'y'
      };
      return Math.sqrt(Math.pow(Math.abs(b[prop.x] - a[prop.x]), 2) + Math.pow(Math.abs(b[prop.y] - a[prop.y]), 2));
    }

    /**
     * Gets the centre point between two touches
     * @param {Array} touches
     */
  }, {
    key: "_getMiddle",
    value: function _getMiddle(touches) {
      var _touches = _slicedToArray(touches, 2),
        touch1 = _touches[0],
        touch2 = _touches[1];
      var mx = (touch2.pageX - touch1.pageX) / 2 + touch1.pageX;
      var my = (touch2.pageY - touch1.pageY) / 2 + touch1.pageY;
      return new js_Point(mx, my);
    }

    /**
     * Gets distance between two touch points (in the window) relative to the element.
     * @param {Array} touches
     * @param {Array} pars
     */
  }, {
    key: "_getDistance2",
    value: function _getDistance2(touches, pars) {
      var anc = this.Ancestry;
      var parentElements = pars || anc.GetParents();
      var t1 = anc.OffsetFromPoint(new js_Point(touches[0].pageX, touches[0].pageY), parentElements);
      var t2 = anc.OffsetFromPoint(new js_Point(touches[1].pageX, touches[1].pageY), parentElements);
      return this._distanceBetweenPoints(t1, t2);
    }

    /**
     * Gets the angle in degrees between two touch points
     * @param {Array} touches
     * @param {Boolean} norm Optional: Normalise to be 0-365 degrees
     */
  }, {
    key: "_getRotation",
    value: function _getRotation(touches, norm) {
      var r = Math.atan2((touches[0].pageY || touches[0].y) - (touches[1].pageY || touches[1].y), (touches[0].pageX || touches[0].x) - (touches[1].pageX || touches[1].x)) * 180 / Math.PI;
      return norm ? this.matrix.normaldegree(r) : r;
    }

    /**
     * Snaps the rotation to a multiple of 15 degrees if within 3 degrees of a multiple of 15 degrees.
     */
  }, {
    key: "snapRotation",
    value: function snapRotation() {
      var _this$options$disable;
      if ((_this$options$disable = this.options.disable) !== null && _this$options$disable !== void 0 && _this$options$disable.rotate) return;
      var r = this.matrix.rotation();
      var m = r - 15 * Math.round(r / 15);
      var am = Math.abs(m);
      var siz = this.sizes.element.initial;
      this.setTransition(true);
      if (am <= 3 && am > 0) {
        var pt = this.lastrotationpoint || new js_Point(siz.width / 2, siz.height / 2);
        this.rotate(pt, -m);
        this.lastlastrotationpoint = undefined;
        this._pushhistory();
      }
      r = this.matrix.rotation();
      var msg;
      switch (Math.abs(Math.round(r * 10) / 10)) {
        case 0:
        case 180:
          msg = 'Horizontal';
          break;
        case 90:
          msg = 'Vertical';
          break;
        default:
          msg = "Rotation: ".concat(Math.round(r * 10) / 10, "&deg;");
      }
      this.showMessage(msg, 'sticky', 2000);
    }

    /**
     * Writes info to the console
     * @param {String} m
     * @param {any} c Not implemented
     * @param {any} t Not implemented
     */
  }, {
    key: "showMessage",
    value: function showMessage(m, c, t) {
      console.log(m);
    }

    /**
     * Gets the centre point of the element in window coordinates
     */
  }, {
    key: "_findCentreInWindow",
    value: function _findCentreInWindow() {
      var prect = this._getRect(this.parent);
      return new js_Point(prect.left + prect.width / 2, prect.top + prect.height / 2);
    }

    /**
     * Centres the element in the middle of its parent element
     * @param {Boolean} transition Optional
     * @param {Array} pars Optional but should always be supplied
     */
  }, {
    key: "centreinparent",
    value: function centreinparent(transition, pars) {
      var was = this.transition;
      this.setTransition(transition);
      var parentElements = pars || this.Ancestry.GetParents();
      var pcs = getComputedStyle(this.parent);
      var parentCentre = new js_Point(parseFloat(pcs.width) / 2, parseFloat(pcs.height) / 2);
      var centreOnThis = this.matrix.inverse().transformpoint(parentCentre);
      this.translate(centreOnThis.sub(new js_Point(this.sizes.element.initial.width / 2, this.sizes.element.initial.height / 2)));
      this.setTransition(was);
    }

    /**
     * Find out if point p is within the rectangle defined by points a,b,c,d
     * @param {Point} p
     * @param {Point} a
     * @param {Point} b
     * @param {Point} c
     * @param {Point} d
     */
  }, {
    key: "pointInRectangle",
    value: function pointInRectangle(p, a, b, c, d) {
      var ab = b.sub(a);
      var ap = p.sub(a);
      var bc = c.sub(b);
      var bp = p.sub(b);
      var dot_abap = ab.dot(ap);
      var dot_abab = ab.dot(ab);
      var dot_bcbp = bc.dot(bp);
      var dot_bcbc = bc.dot(bc);
      return {
        dot_abap: dot_abap,
        dot_abab: dot_abab,
        dot_bcbp: dot_bcbp,
        dot_bcbc: dot_bcbc,
        ok: 0 <= dot_abap && Math.round(dot_abap * 10) / 10 <= Math.round(dot_abab * 10) / 10 && 0 <= dot_bcbp && Math.round(dot_bcbp * 10) / 10 <= Math.round(dot_bcbc * 10) / 10
      };
    }

    /**
     * Triggers an event named n. 
     * In the handler, this will refer to the Transformable instance.
     * The handler will receive the transformable element as first argument and a real event object as the second argument.
     * @param {String} n
     * @param {Event} event Pass in a real event object if you have one
     */
  }, {
    key: "trigger",
    value: function trigger(n, event) {
      if (typeof this.events[n] === "function") {
        this.events[n].call(this, this.element, event);
      }
    }

    /**
     * Gets the points data needed to make rotation handles work
     * @param {Event} e
     * @param {Array} pars
     */
  }, {
    key: "_getRotatorPoints",
    value: function _getRotatorPoints(e, pars) {
      var anc = this.Ancestry;
      var parentElements = pars || anc.GetParents();
      anc._setoffset();
      var touches = e.touches;
      var rpoint = touches ? new js_Point(touches[0].pageX, touches[0].pageY) : new js_Point(e.pageX, e.pageY);
      var apoint = this.anchor.TL;
      var angle = Math.round(this._getRotation([apoint.add(anc.scroll), rpoint], false) * 100) / 100;
      return {
        deltaXY: null,
        offset: anc.OffsetFromPoint(rpoint, parentElements),
        pageXY: rpoint,
        pageX: rpoint.x,
        pageY: rpoint.y,
        angle: angle,
        distance: 0
      };
    }

    /**
     * Attaches events for rotation interactions with rotation handles
     * @param {HTMLElement} hdl The element to use as a rotation handle
     */
  }, {
    key: "_addRotateEvents",
    value: function _addRotateEvents(hdl) {
      var _this3 = this;
      var _dostart = function _dostart(e) {
        if (_this3.options.disabled || _this3.startedresize) return;
        if (document.querySelectorAll('.transformable-active').length == 0) _this3.element.classList.add('transformable-active');
        var m = _this3.matrix;
        _this3.origrotate = {
          trans: new js_Point(m.elements[4], m.elements[5]),
          angle: m.rotation(true),
          scale: m.scaling()
        };
        var touches = e.touches;
        if ((touches === null || touches === void 0 ? void 0 : touches.length) === 2) if (touches[0].target && touches[1].target) if (touches[0].target !== touches[1].target) {
          console.log('Two active elements not supported');
          return false;
        }
        _this3.anchor = _this3.anchor || {};
        _this3.anchor.clientRect = _this3._getRect(_this3.element.querySelector('.transformable-anchor-point'));
        _this3.anchor.TL = new js_Point(_this3.anchor.clientRect.left, _this3.anchor.clientRect.top);
        _this3.startrotate = _this3._getRotatorPoints(e);
        _this3.startrotate.scale = _this3.origrotate.scale;
        _this3.startedrotate = true;
        _this3.draggingrotate = false;
        _this3.setTransition(false);
        e.stopPropagation();
        if (e.type === 'mousedown') {
          _this3.on(document.body, 'mousemove.transformable', _domove);
          _this3.on(document.body, 'mouseup.transformable dragend.transformable', _dostop);
        }
      };
      var _domove = function _domove(e) {
        var _e$touches;
        if (!_this3.startedrotate) return;
        _this3.draggingrotate = true;
        e.preventDefault();
        e.stopPropagation();
        if (((_e$touches = e.touches) === null || _e$touches === void 0 ? void 0 : _e$touches.length) === 2) return;
        var point = _this3._getRotatorPoints(e);
        var delta = {
          angle: Math.round((point.angle - _this3.startrotate.angle) * 100) / 100
        };
        if (delta.angle !== 0) {
          if (_this3.parent !== _this3.options.rotatetarget.element) {
            _this3.matrix.rotateAboutPoint(new js_Point(0), delta.angle);
            _this3._updateElement();
          }
          if (_this3.options.rotatetarget instanceof Transformable) {
            _this3.options.rotatetarget.rotate(_this3.anchor.TL.add(_this3.Ancestry.scroll), delta.angle, false, true);
          }
        }
        _this3.startrotate.angle = point.angle;
      };
      var _dostop = function _dostop(e) {
        e.preventDefault();
        e.stopPropagation();
        _this3.element.classList.remove('transformable-active');
        _this3.startedrotate = false;
        _this3.draggingrotate = false;
        _this3.off(document.body, 'mouseup.transformable dragend.transformable');
        if (_this3.options.rotatetarget instanceof Transformable) {
          if (_this3.options.rotatetarget.events.stop) _this3.options.rotatetarget.trigger('stop', e);
          _this3.options.rotatetarget.snapRotation();
        }
        if (_this3.events.stop) _this3.trigger('stop', e);
        _this3.snapRotation();
      };
      this.on(hdl, 'mousedown.transformable touchstart.transformable', _dostart);
      this.on(hdl, 'touchmove.transformable', _domove);
      this.on(hdl, 'touchend.transformable', _dostop);
    }

    /**
     * Attaches events for resize interactions with resize handles
     * @param {HTMLElement} tlb Top left button/handle used for moving the element
     * @param {HTMLElement} brb Bottom right button/handle for resizing the element's width/height
     */
  }, {
    key: "_addResizeEvents",
    value: function _addResizeEvents(tlb, brb) {
      var _this4 = this;
      var _dostart = function _dostart(e) {
        var _this4$contained;
        if (!document.querySelector('.transformable-active')) {
          _this4.element.classList.add('transformable-active');
        }
        e.preventDefault();
        e.stopPropagation();
        var m = _this4.matrix;
        _this4.origresize = {
          trans: new js_Point(m.elements[4], m.elements[5]),
          angle: m.rotation(),
          scale: m.scaling()
        };
        _this4.startresize = _this4._getPoint2(e, e.touches);
        _this4.startresize.scale = _this4.origresize.scale;
        _this4.startedresize = true;
        _this4.draggingresize = false;
        var cs = getComputedStyle(_this4.element);
        _this4.h = parseFloat(cs.height);
        _this4.w = parseFloat(cs.width);
        _this4.contained = (_this4$contained = _this4.contained) !== null && _this4$contained !== void 0 ? _this4$contained : true;
        _this4.trigger('startresize', e);
        _this4.setTransition(false);
        if (e.type === 'mousedown') {
          _this4.on(document.body, 'mousemove.transformable', _domove);
          _this4.on(document.body, 'mouseup.transformable dragend.transformable', _dostop2);
        }
      };
      var _domove = function _domove(e) {
        var _e$touches2;
        if (!_this4.element.classList.contains('transformable-active') || !_this4.startedresize) return;
        _this4.draggingresize = true;
        e.preventDefault();
        e.stopPropagation();
        if (((_e$touches2 = e.touches) === null || _e$touches2 === void 0 ? void 0 : _e$touches2.length) === 2) return;
        var point = _this4._getPoint2(e, e.touches);
        var start = _this4.startresize;
        var delta = {
          trans: point.offset.sub(_this4.startresize.offset),
          angle: Math.round((point.angle - start.angle) * 100) / 100,
          distance: start.distance != 0 ? Math.round(point.distance / ((start.distance + point.distance) / 2) * 1000) / 1000 : 0
        };
        if (delta.trans.nonzero()) {
          var cs = getComputedStyle(_this4.element);
          var h = parseFloat(cs.height);
          var w = parseFloat(cs.width);
          var dw = _this4.w - w;
          var dh = _this4.h - h;
          var neww = w + delta.trans.x + dw;
          var newh = h + delta.trans.y + dh;
          _this4.element.style.width = "".concat(neww, "px");
          _this4.element.style.height = "".concat(newh, "px");
          _this4.sizes.element.initial.bottomright = new js_Point(neww, newh);
          _this4.sizes.element.initial.topright.x = neww;
          _this4.sizes.element.initial.bottomleft.y = newh;
          _this4.sizes.element.initial.width = neww;
          _this4.sizes.element.initial.height = newh;
        }
        _this4.startresize.angle = point.angle;
      };
      var _dostop2 = function _dostop() {
        _this4.off(document.body, 'mousemove.transformable', _domove);
        _this4.off(document.body, 'mouseup.transformable dragend.transformable', _dostop2);
        if (_this4.options.disabled) return;
        _this4.element.classList.remove('transformable-active');
        _this4.startedresize = false;
        _this4.draggingresize = false;
      };
      this.on(brb, 'mousedown.transformable', _dostart);
      this.on(brb, 'touchstart.transformable', _dostart);
      this.on(brb, 'touchmove.transformable', _domove);
      this.on(brb, 'touchend.transformable', _dostop2);
    }

    /**
     * Gets the quadrant based on angle r and wether the angle is horizontal or vertical
     * @param {Number} r
     */
  }, {
    key: "getRotationQuadrant",
    value: function getRotationQuadrant(r) {
      var rot = (r !== null && r !== void 0 ? r : this.matrix.rotation()) % 360;
      var normalizedRot = rot < 0 ? rot + 360 : rot;
      return {
        Angle: normalizedRot,
        Quad: Math.floor(normalizedRot / 90),
        Horiz: normalizedRot === 0 || normalizedRot === 180,
        Vert: normalizedRot === 90 || normalizedRot === 270
      };
    }

    /**
     * Attaches events for scaling, rotating and moving elements. 
     * Calculates and applies containment too.
     */
  }, {
    key: "_addEvents",
    value: function _addEvents() {
      var _this5 = this,
        _this$options$disable2;
      if (typeof this.events.transition === 'function') {
        this.element.addEventListener('transitionend', this.events.transition);
      }
      var _dostart = function _dostart(e) {
        if (_this5.options.disabled || _this5.startedresize || _this5.startedrotate) return;
        if (!document.querySelector('.transformable-active')) {
          _this5.element.classList.add('transformable-active');
        }
        if (_this5.options.type === 'rotator-box') {
          var rb = e.target.closest('svg');
          if (rb && !rb.classList.contains('transformable-svg-anchor')) return false;else e.stopPropagation();
        }
        var touches = e.touches;
        _this5.start = _this5._getPoint2(e, touches);
        var ww = _this5.sizes.window;
        if (_this5.start.pageX < 40 || _this5.start.pageX > ww.width - 40) {
          // don't translate if history navigation can happen from swiping at the edges of webpage.  e.g. on a touch device
          console.log('edge cancel.');
          return false;
        }
        _this5.delta = {
          x: 0,
          y: 0
        };
        if ((touches === null || touches === void 0 ? void 0 : touches.length) === 2) if (touches[0].target && touches[1].target) if (touches[0].target !== touches[1].target) {
          console.log('Two active elements not supported');
          return false;
        }
        var m = _this5.matrix;
        _this5.orig = {
          trans: new js_Point(m.elements[4], m.elements[5]),
          angle: m.rotation(),
          scale: m.scaling()
        };
        _this5.start.scale = _this5.orig.scale;
        _this5.started = true;
        _this5.dragging = false;
        if (_this5.events.start) _this5.trigger('start', e);
        _this5.setTransition(false);
        if (e.type === 'mousedown') {
          _this5.on(document.body, 'mousemove.transformable', _domove);
          _this5.on(document.body, 'mouseup.transformable dragend.transformable', _dostop3);
        }
      };
      var _domove = function _domove(e) {
        if (_this5.options.disabled || !_this5.element.classList.contains('transformable-active') || !_this5.started || _this5.startedresize || _this5.startedrotate) return false;
        _this5.dragging = true;
        e.preventDefault();
        e.stopPropagation();

        // Note: The logic for containment in this method is extremely complex and has been kept as close to the original as possible during refactoring.
        // Modernizing it further would require a deep re-architecture of the containment algorithm itself.
        var touches = e.touches;
        var doupdate = false;
        if ((touches === null || touches === void 0 ? void 0 : touches.touches.length) == 2) if (touches[0].target && touches[1].target) if (touches[0].target !== touches[1].target) {
          console.log('Two active elements not supported');
          return false;
        }
        var m = _this5.matrix;
        var disable = _this5.options.disable;
        var docontain = _this5.options && _this5.options.contain;
        var disableZoom = (disable === null || disable === void 0 ? void 0 : disable.zoom) || (disable === null || disable === void 0 ? void 0 : disable.scale);
        var disableRotate = disable === null || disable === void 0 ? void 0 : disable.rotate;
        var disableTranslate = disable === null || disable === void 0 ? void 0 : disable.translate;
        var point = _this5._getPoint2(e, touches);
        var orig = _this5.orig;
        var start = _this5.start;
        var delta = {
          trans: point.offset.sub(start.offset),
          angle: Math.round((point.angle - start.angle) * 100) / 100,
          distance: start.distance !== 0 ? Math.round(point.distance / ((start.distance + point.distance) / 2) * 1000) / 1000 : 0
        };
        var that = _this5;
        if (docontain && delta.angle == 0 && (!touches || touches && touches.length == 1)) {
          var tl, tr, br, bl;
          var anc = that.Ancestry,
            parentT = anc.FirstParent(),
            prect = parentT.rect,
            inv = m.inverse(),
            ptl = prect.topleft,
            ptr = prect.topright,
            pbr = prect.bottomright,
            pbl = prect.bottomleft;
          tl = inv.transformpoint(ptl).sub(delta.trans);
          tr = inv.transformpoint(ptr).sub(delta.trans);
          br = inv.transformpoint(pbr).sub(delta.trans);
          bl = inv.transformpoint(pbl).sub(delta.trans);
          if (!start.size) start.size = new js_Point(that._distanceBetweenPoints(tl, tr), that._distanceBetweenPoints(tl, bl));else start.size = delta.distance != 0 ? new js_Point(that._distanceBetweenPoints(tl, tr), that._distanceBetweenPoints(tl, bl)) : start.size;
          var csiz = that.sizes.element.initial;
          var containment,
            opts = that.options;
          if (docontain == 'enclose') {
            var enclosed = {
              tl: that.pointInRectangle(csiz.topleft, tl, tr, br, bl),
              tr: that.pointInRectangle(csiz.topright, tl, tr, br, bl),
              br: that.pointInRectangle(csiz.bottomright, tl, tr, br, bl),
              bl: that.pointInRectangle(csiz.bottomleft, tl, tr, br, bl)
            };
            var containcount = 0;
            if (enclosed.tl.ok) containcount++;
            if (enclosed.tr.ok) containcount++;
            if (enclosed.br.ok) containcount++;
            if (enclosed.bl.ok) containcount++;
            var contained = containcount == 4;
            if (!contained) {
              var quad = that.getRotationQuadrant(start.angle);
              switch (quad.Quad) {
                case 0:
                  if (quad.Angle == 0) {
                    if (!enclosed.br.ok) {
                      var brv = csiz.bottomright.perpOnLine(tr, br).sub(csiz.bottomright),
                        brh = csiz.bottomright.perpOnLine(bl, br).sub(csiz.bottomright);
                      if (brv.x < 0) delta.trans = delta.trans.add(brv);
                      if (brh.y < 0) delta.trans = delta.trans.add(brh);
                    }
                    if (!enclosed.tl.ok) {
                      var tlv = csiz.topleft.perpOnLine(tl, bl),
                        tlh = csiz.topleft.perpOnLine(tl, tr);
                      if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                      if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                    }
                  } else {
                    if (!enclosed.bl.ok) {
                      var blv = csiz.bottomleft.perpOnLine(tl, bl).sub(csiz.bottomleft); //,

                      if (blv.x > 0) delta.trans = delta.trans.add(blv);
                    }
                    if (!enclosed.br.ok) {
                      var brh = csiz.bottomright.perpOnLine(bl, br).sub(csiz.bottomright);
                      if (brh.y < 0) delta.trans = delta.trans.add(brh);
                    }
                    if (!enclosed.tr.ok) {
                      var trv = csiz.topright.perpOnLine(tr, br).sub(csiz.topright); //,
                      if (trv.x < 0) delta.trans = delta.trans.add(trv);
                    }
                    if (!enclosed.tl.ok) {
                      var tlh = csiz.topleft.perpOnLine(tl, tr);
                      if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                    }
                  }
                  break;
                case 3:
                  if (quad.Angle == 270) {
                    if (!enclosed.tl.ok) {
                      var tlh = csiz.topleft.perpOnLine(tl, bl),
                        tlv = csiz.topleft.perpOnLine(bl, br);
                      if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                      if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                    }
                    if (!enclosed.br.ok) {
                      var brv = csiz.bottomright.perpOnLine(tl, tr).sub(csiz.bottomright),
                        brh = csiz.bottomright.perpOnLine(br, tr).sub(csiz.bottomright);
                      if (brv.x < 0) delta.trans = delta.trans.add(brv);
                      if (brh.y < 0) delta.trans = delta.trans.add(brh);
                    }
                  } else {
                    if (!enclosed.tl.ok) {
                      var tlv = csiz.topleft.perpOnLine(tl, bl);
                      if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                    }
                    if (!enclosed.br.ok) {
                      var brv = csiz.bottomright.perpOnLine(tr, br).sub(csiz.bottomright);
                      if (brv.x < 0) delta.trans = delta.trans.add(brv);
                    }
                    if (!enclosed.tr.ok) {
                      var trh = csiz.topright.perpOnLine(tl, tr).sub(csiz.topright);
                      if (trh.y > 0) delta.trans = delta.trans.add(trh);
                    }
                    if (!enclosed.bl.ok) {
                      var blh = csiz.bottomleft.perpOnLine(bl, br).sub(csiz.bottomleft);
                      if (blh.y < 0) delta.trans = delta.trans.add(blh);
                    }
                  }
                  break;
                case 1:
                  if (quad.Angle == 90) {
                    // can get away with 2 perp calcs instead of 4;
                    if (!enclosed.tl.ok) {
                      var tlv = csiz.topleft.perpOnLine(tr, tl),
                        tlh = csiz.topleft.perpOnLine(tr, br);
                      if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                      if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                    }
                    if (!enclosed.br.ok) {
                      var brv = csiz.bottomright.perpOnLine(br, bl).sub(csiz.bottomright),
                        brh = csiz.bottomright.perpOnLine(tl, bl).sub(csiz.bottomright);
                      if (brv.x < 0) delta.trans = delta.trans.add(brv);
                      if (brh.y < 0) delta.trans = delta.trans.add(brh);
                    }
                  } else {
                    if (!enclosed.tl.ok) {
                      var tlv = csiz.topleft.perpOnLine(tr, br);
                      if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                    }
                    if (!enclosed.br.ok) {
                      var brv = csiz.bottomright.perpOnLine(tl, bl).sub(csiz.bottomright);
                      if (brv.x < 0) delta.trans = delta.trans.add(brv);
                    }
                    if (!enclosed.tr.ok) {
                      var trh = csiz.topright.perpOnLine(bl, br).sub(csiz.topright);
                      if (trh.y > 0) delta.trans = delta.trans.add(trh);
                    }
                    if (!enclosed.bl.ok) {
                      var blh = csiz.bottomleft.perpOnLine(tr, tl).sub(csiz.bottomleft);
                      if (blh.y < 0) delta.trans = delta.trans.add(blh);
                    }
                  }
                  break;
                case 2:
                  if (quad.Angle == 180) {
                    // can get away with 2 calcs instead of 4;
                    if (!enclosed.tl.ok) {
                      var tlv = csiz.topleft.perpOnLine(br, bl),
                        tlh = csiz.topleft.perpOnLine(tl, bl);
                      if (tlv.y > 0) delta.trans = delta.trans.add(tlv);
                      if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                    }
                    if (!enclosed.br.ok) {
                      var brv = csiz.bottomright.perpOnLine(tr, tl).sub(csiz.bottomright),
                        brh = csiz.bottomright.perpOnLine(tr, br).sub(csiz.bottomright);
                      if (brv.y < 0) delta.trans = delta.trans.add(brv);
                      if (brh.y < 0) delta.trans = delta.trans.add(brh);
                    }
                  }
                  if (!enclosed.tl.ok) {
                    var tlv = csiz.topleft.perpOnLine(br, bl);
                    if (tlv.y > 0) delta.trans = delta.trans.add(tlv);
                  }
                  if (!enclosed.br.ok) {
                    var brv = csiz.bottomright.perpOnLine(tr, tl).sub(csiz.bottomright); //,
                    if (brv.y < 0) delta.trans = delta.trans.add(brv);
                  }
                  if (!enclosed.tr.ok) {
                    var trh = csiz.topright.perpOnLine(tl, bl).sub(csiz.topright);
                    if (trh.x < 0) delta.trans = delta.trans.add(trh);
                  }
                  if (!enclosed.bl.ok) {
                    var blh = csiz.bottomleft.perpOnLine(tr, br).sub(csiz.bottomleft);
                    if (blh.x > 0) delta.trans = delta.trans.add(blh);
                  }
                  break;
              }
            }
          }
          if (docontain == 'cover') {
            var enclosed = {
              tl: that.pointInRectangle(csiz.topleft, tl, tr, br, bl),
              tr: that.pointInRectangle(csiz.topright, tl, tr, br, bl),
              br: that.pointInRectangle(csiz.bottomright, tl, tr, br, bl),
              bl: that.pointInRectangle(csiz.bottomleft, tl, tr, br, bl)
            };
            var okcorners = 0;
            if (!enclosed.tl.ok) okcorners++;
            if (!enclosed.tr.ok) okcorners++;
            if (!enclosed.br.ok) okcorners++;
            if (!enclosed.bl.ok) okcorners++;
            if (!enclosed.tl.ok && !enclosed.tr.ok && !enclosed.br.ok && !enclosed.bl.ok || that.lockcontain || okcorners == 3 && start.angle == 0) {
              that.lockcontain = true;
              var quad = that.getRotationQuadrant(start.angle);
              switch (quad.Quad) {
                case 0:
                  if (tr.y <= 0) delta.trans.y = delta.trans.y + tr.y;
                  if (bl.y >= csiz.bottomleft.y) delta.trans.y = delta.trans.y + (bl.y - csiz.bottomleft.y);
                  if (br.x >= csiz.bottomright.x) delta.trans.x = delta.trans.x + (br.x - csiz.bottomright.x);
                  if (tl.x <= 0) delta.trans.x = delta.trans.x + tl.x;
                  break;
                case 1:
                  if (tl.y >= csiz.bottomleft.y) delta.trans.y = delta.trans.y + (tl.y - csiz.bottomleft.y);
                  if (bl.x >= csiz.topright.x) delta.trans.x = delta.trans.x - (csiz.topright.x - bl.x);
                  if (br.y <= 0)
                    // works
                    delta.trans.y = delta.trans.y + br.y;
                  if (tr.x <= 0) delta.trans.x = delta.trans.x + tr.x;
                  break;
                case 2:
                  if (bl.y <= 0)
                    // works
                    delta.trans.y = delta.trans.y + bl.y;
                  if (tl.x >= csiz.bottomright.x) delta.trans.x = delta.trans.x - (csiz.bottomright.x - tl.x);
                  if (tr.y >= csiz.bottomleft.y) delta.trans.y = delta.trans.y + (tr.y - csiz.bottomleft.y);
                  if (br.x <= 0) delta.trans.x = delta.trans.x + br.x;
                  //console.log('points')
                  //console.log(tl)
                  //console.log(tr)
                  //console.log(br)
                  //console.log(bl)
                  break;
                case 3:
                  if (tl.y <= 0)
                    // works
                    delta.trans.y = delta.trans.y + tl.y;
                  if (bl.x <= 0) delta.trans.x = delta.trans.x + bl.x;
                  if (br.y >= csiz.bottomright.y)
                    // works
                    delta.trans.y = delta.trans.y + (br.y - csiz.bottomright.y);
                  if (tr.x >= csiz.topright.x) delta.trans.x = delta.trans.x - (csiz.topright.x - tr.x);
                  break;
              }
            }
          }
        }
        if (delta.trans.nonzero() && !disableTranslate) {
          m.translate(delta.trans);
          doupdate = true;
          that.delta.x += delta.trans.x;
          that.delta.y += delta.trans.y;
        }
        if (delta.distance != 0 && delta.distance != 1 && touches) if (touches.length == 2 && !disableZoom) {
          m.scale(point.offset, delta.distance);
          doupdate = true;
        }
        if (delta.angle != 0 && !disableRotate) {
          m.rotateAboutPoint(point.offset, delta.angle);
          doupdate = true;
        }
        if (doupdate) that._updateElement(m);
        that.start.angle = point.angle;
        if (that.events.move) that.trigger('move', e);
        return false;
      };
      var _dostop3 = function _dostop(e) {
        _this5.off(document.body, 'mousemove.transformable', _domove);
        _this5.off(document.body, 'mouseup.transformable dragend.transformable', _dostop3);
        _this5.element.classList.remove('transformable-active', 'transformable-reset');
        if (_this5.options.disabled) return false;
        _this5.lockcontain = false;
        if (_this5.started && _this5.dragging) {
          _this5._pushhistory();
          _this5.snapRotation();
        }
        if (_this5.started && !_this5.dragging) {
          _this5.trigger('tap', e);
        }
        _this5.dragging = false;
        _this5.started = false;
        if (_this5.events.stop) _this5.trigger('stop', e);
        _this5.setTransition(true);

        // Scale handles on stop

        var that = _this5;
        var rb = that.rotatorBox,
          tlb = that.resizertl,
          brb = that.resizerbr;
        if (rb) {
          var nsc = that.matrix.scaling();
          rb.scale(new js_Point(0), 1 / rb.matrix.scaling() * (1 / nsc));
        }
        if (tlb && brb) {
          var nscc = nsc || that.matrix.scaling(); //,

          tlb.style.transform = 'scale(' + 1 / nscc + ')';
          brb.style.transform = 'scale(' + 1 / nscc + ')';
        }
      };
      var _dowheelzoom = function _dowheelzoom(e) {
        if (_this5.options.disabled || _this5.startedresize || _this5.startedrotate || _this5.options.type === 'rotator-box') return false;
        e.preventDefault();
        e.stopPropagation();
        var now = Date.now();
        var dmw = _this5.lastwheelmove ? now - _this5.lastwheelmove : 150;
        if (dmw < 150 && navigator.userAgent.includes('Mac')) return false;
        if (!document.querySelector('.transformable-active')) {
          _this5.element.classList.add('transformable-active');
        }
        if (_this5.rotatorBox) {
          _this5.rotatorBox.parent.classList.add('transformable-wheel-active');
        }
        if (_this5._wheelTimer) clearTimeout(_this5._wheelTimer);
        var point = _this5._getPoint2(e);
        var m = _this5.matrix;
        _this5.setTransition(true);
        if (point.deltaXY.y !== 0) {
          var acc = point.deltaXY.y < 0 ? 1 : -1;
          var ds = 1 + 0.05 * acc;
          m.scale(point.offset, ds);
          _this5._updateElement();
        }
        _this5.element.classList.remove('transformable-active');
        _this5._wheelTimer = setTimeout(function () {
          _this5._pushhistory();
          if (_this5.rotatorBox) {
            _this5.rotatorBox.parent.classList.remove('transformable-wheel-active');
          }
        }, 750);
        _this5.lastwheelmove = now;
      };
      this.on(this.element, 'mousedown.transformable', _dostart);
      this.on(this.element, 'touchstart.transformable', _dostart);
      this.on(this.element, 'touchmove.transformable', _domove);
      this.on(this.element, 'touchend.transformable', _dostop3);
      this.on(this.element, 'scroll.transformable', function (e) {
        console.log('tried scroll');
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
      if (!this.options.disable || (_this$options$disable2 = this.options.disable) !== null && _this$options$disable2 !== void 0 && _this$options$disable2.wheel) if (!navigator.userAgent.includes('Mac OS'))
        // some issues with wild zoom on magic mouse, so turn it off
        addWheelListener(this.element, _dowheelzoom);
    }

    /**
     * attaches events to an element
     * @param {HTMLElement} el The element to attach the event to
     * @param {String} event Type of event with optional namespace. E.g. touchstart.mynamespace
     * @param {Function} func Handler function
     * @param {Object} opts Options to use when attaching the event
     */
  }, {
    key: "on",
    value: function on(el, event, func, opts) {
      //const events = event.split(' ');
      //for (const evt of events) {
      //    const [ev, ns] = evt.split('.');
      //    el.addEventListener(ev, func, opts || false);

      //    Transformable.Handlers.Namespaces[evt] = Transformable.Handlers.Namespaces[evt] || [];
      //    if (ns) Transformable.Handlers.Namespaces[ns] = Transformable.Handlers.Namespaces[ns] || [];

      //    const handler = { event: ev, func, opts: opts || false };
      //    Transformable.Handlers.Namespaces[evt].push(handler);
      //    if (ns) Transformable.Handlers.Namespaces[ns].push(handler);
      //}

      var events = event.split(' '),
        i,
        sp,
        ev,
        ns,
        pl;
      for (i = 0; i < events.length; i++) {
        sp = events[i].split('.'), ev = sp[0], ns = sp.length > 1 ? sp[1] : false;
        el.addEventListener(ev, func, opts || false);
        if (!Transformable.Handlers.Namespaces[event]) Transformable.Handlers.Namespaces[event] = [];
        if (ns) if (!Transformable.Handlers.Namespaces[ns]) Transformable.Handlers.Namespaces[ns] = [];
        pl = Transformable.Handlers.Namespaces[event].push({
          event: ev,
          func: func,
          opts: opts || false
        });
        if (ns) Transformable.Handlers.Namespaces[ns].push(Transformable.Handlers.Namespaces[event][pl - 1]);
      }
    }

    /**
     * Removes an event previously added with .on(...)
     * @param {HTMLElement} el The element to remove the event from
     * @param {String} event Handler function to remove
     * @param {Object} opts Options to use when removing the event
     */
  }, {
    key: "off",
    value: function off(el, event, opts) {
      var handlers = Transformable.Handlers.Namespaces[event];
      if (handlers) {
        var _iterator = _createForOfIteratorHelper(handlers),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var handler = _step.value;
            el.removeEventListener(handler.event, handler.func, handler.opts || false);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }

    /**
     * Resets/updates the instance.
     */
  }, {
    key: "Refresh",
    value: function Refresh() {
      this.sizes = undefined;
      this.setInitialSizes();
      this.Ancestry.Refresh();
    }
  }]);
}();
/**
 * A store/lookup of all transformable instances.
 * Each transformable element is given a data attribute for its id in this lookup.
 */
_defineProperty(transformable_Transformable, "Instance", []);
/**
 * Datastore for any namespaced events attached to elements by .on(....)
 */
_defineProperty(transformable_Transformable, "Handlers", {
  Namespaces: {}
});
;
(function () {
  var timer;
  var refreshtransformables = function refreshtransformables() {
    document.querySelectorAll('.transformable').forEach(function (v) {
      var i = v.getAttribute('data-transformable-id');
      var t = i ? transformable_Transformable.Instance[i] : null;
      if (t instanceof transformable_Transformable) {
        t.Refresh();
      }
    });
  };
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(refreshtransformables, 150);
  });
})();
// Ensure Transformable is available as a global for UMD/browser builds
if (typeof window !== 'undefined') {
  window.Transformable = transformable_Transformable;
}
/* harmony default export */ var transformable = (transformable_Transformable);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=transformable.dev.umd.js.map