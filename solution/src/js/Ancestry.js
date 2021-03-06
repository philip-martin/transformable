﻿var Ancestry = function (self) {
    this.Items = [];
    this._add(self, self.element);
    this.Self = self;
    this._init();
}
Ancestry.prototype._getScroll = function () {
    return new Point(window.pageXOffset || document.documentElement.scrollLeft, window.pageYOffset || document.documentElement.scrollTop);
}
/**
 * Gets size/positions from computed style
 * @param {HtmlElement} el
 * @param {CSSStyleDeclaration} cs If you just got the computed styles, pass them in.
 */
Ancestry.prototype.GetElementSize = function (el, cs) {
    cs = cs || getComputedStyle(el);

    var left = parseFloat(cs.left),
        top = parseFloat(cs.top),
        w = parseFloat(cs.width),
        h = parseFloat(cs.height);

    return {
        offset: new Point(left || 0, top || 0),
        width: w,
        height: h,
        topleft: new Point(0, 0),
        topright: new Point(w, 0),
        bottomright: new Point(w, h),
        bottomleft: new Point(0, h)
    }
}
/**
 * Prints out the Ancestry to console
 */
Ancestry.prototype._debug = function () {
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
Ancestry.prototype.Refresh = function () {
    this.Items = [];
    this._add(this.Self, this.Self.element);
    //this.scroll = Point.Point0;
    this.Init();
}

/**
 * Checks a computed style value to see if it is in percent instead of px 
 * @param {String|Number} v
 */
Ancestry.prototype._ispercent = function (v) { return v.indexOf('%') > -1; }

/**
 * Checks a computed style value to see if it is auto
 * @param {String|Number} v
 */
Ancestry.prototype._isauto = function (v) { return v == 'auto'; }

/**
 * Converts percentage values obtained from buggy browsers to pixels
 * @param {String} k CSS style to calculate
 * @param {String|Number} val The percentage value to convert to pixels
 * @param {CSSStyleDeclaration} cs The computed styles of the parent element. E.g. getComputedStyle(parentElement);
 */
Ancestry.prototype._pixelFromParent = function (k, val, cs) {
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
Ancestry.prototype.GetComputedDims = function (el) {
    var cs = getComputedStyle(el),
        cl = cs.left,
        ct = cs.top,
        cmt = cs.marginTop,
        cml = cs.marginLeft,
        leftp = this._ispercent(cl),
        topp = this._ispercent(ct),
        l, t, mt, ml, pcs, pf = function (v) { return parseFloat(v); }

    if (this._isauto(cl)) cl = 0;
    if (this._isauto(ct)) ct = 0;

    if (leftp || topp)
        pcs = getComputedStyle(el.parentNode);

    if (leftp) l = this._pixelFromParent('left', cl, pcs);
    if (topp) t = this._pixelFromParent('top', ct, pcs);;

    return {
        left: typeof l != 'undefined' ? l : pf(cl),
        top: typeof t != 'undefined' ? t : pf(ct),
        marginLeft: pf(cml),
        marginTop: pf(cmt),
        transform: cs.transform
    }
}

/**
 * Walks upwards through node hierarchy replacing any position/offset changing CSS with an equivalent matrix.
 * This simplifies matrix calculations and means no CSS restrictions are required on elements you want to make transformable.
 */
Ancestry.prototype._init = function () {
    var t, cs, nt, has, pt, tid, nm, el = this.Self.element;
    while (el.parentNode && !el.parentNode.body) {
        var
        cs = this.GetComputedDims(el.parentNode),
        t = cs.transform,
        has = /matrix\(\-?[0-9]+[^\)]+\)/.test(t),
        top = cs.top,
        left = cs.left,
        margintop = cs.marginTop,
        marginleft = cs.marginLeft;

        if (has || el.parentNode.classList.contains('transformable') || el.classList.contains('transformable')
            || top != 0 || left != 0
            || margintop != 0
            || marginleft != 0
            ) {
            if (tid = el.parentNode.getAttribute('data-transformable-id')) {
                pt = Transformable.Instance[tid];
                if (pt)
                    this._add(pt);
            } else {
                var om = has ? new Matrix(this.Self._cssStringToArray(t)) : false;                

                if (has || top != 0 || left != 0 || margintop != 0 || marginleft != 0 || el.classList.contains('transformable')) {
                    nm = new Matrix();
                    nm.translate(left||0, top||0).translate(marginleft||0, margintop||0);

                    if (om)
                        nm.multiply(om.elements);

                    var
                        prect = this.GetElementSize(el.parentNode);

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
Ancestry.prototype._setoffset = function () {
    this.scroll = this._getScroll();
    if(this.offset) return;
    var cur, trans = new Matrix(), i;
    for (i = 0; i < this.Items.length; i++)
        trans.translate(this.Items[i].matrix.translation());

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
Ancestry.prototype._add = function (t, el) {
    if (t instanceof Transformable) {
        this.Items.unshift({ matrix: t.matrix, element: el || t.element, rect: t.sizes.element.initial, transformable: t });
    }
    if (t instanceof Matrix) {
        this.Items.unshift({ matrix: t, element: el, rect: this.GetElementSize(el) });
    }
}
/**
 * Returns Array of objects for each parent element.
 * Gets the matrix, inverse matrix and the element for each parent.
 */
Ancestry.prototype.GetParents = function () {
    var r = [], that = this;
    //this._setoffset();
    this.Items.forEach(function (v, i) {
        var t = v.transformable, m, inv, ti;
        if (!t)
            if (ti = v.element.getAttribute('data-transformable-id')) {
                t = Transformable.Instance[ti];
                v.transformable = t;
            }

        var m = t ? t.matrix : v.matrix
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
Ancestry.prototype.TransformCorners = function (c) {
    var mat = this.GetMatrix();
    return {
        bottomright: mat.transformpoint(c.bottomright),
        bottomleft: mat.transformpoint(c.bottomleft),
        topright: mat.transformpoint(c.topright),
        topleft: mat.transformpoint(c.topleft)
    }
}
/**
 * Gets data from Items for the outermost containing element.
 */
Ancestry.prototype.FirstParent = function () {
    var t = this, i = t.Items, l = i.length,
        par = l > 1 ? i[l - 2] : false;

    return par;
}
/**
 Gets the combined effective matrix based on all matrices that have an effect on the element
 */
Ancestry.prototype.GetMatrix = function () {
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
Ancestry.prototype.OffsetFromPoint = function (p, pars) {
    var pars = pars || this.GetParents();
    this._setoffset();
    var op = p,
        cur, ftran,
        mat = Matrix.Identity().translate(this.offset);

    for (var i = 0; i < pars.length; i++) {
        cur = pars[i];
        mat.multiply(cur.Matrix.elements);
    }

    var matinv = mat.inverse();
    op = matinv.transformpoint(op); 

    return op;
}
