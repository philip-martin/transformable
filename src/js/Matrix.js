import Point from './Point.js';

var Matrix = function (a) {
    if (a == null || typeof a == 'undefined')
        return Matrix.Identity();

    if (a instanceof Array) {
        this.elements = a.slice(0);
    } else {
        if(a instanceof Matrix) {
            this.elements = a.elements.slice(0);
        } else {
            if (arguments.length == 6) {
                this.elements = [];
                var i = 0;
                while (i < arguments.length)
                    this.elements.push(arguments[i++]);
            } else
                throw new Error("Can't create Matrix from supplied arguments. Array of 6 elements, Matrix or nothing only.");
        }
    }
    this.history = { undo: [], redo: [] };

    return this;
}
Matrix.Identity = function () {
    return new Matrix([1, 0, 0, 1, 0, 0]);
}
Matrix.prototype = {
    transformpoint: function (pt) {
        var m = this.elements;
		return new Point(
			pt.x * m[0] + pt.y * m[2] + m[4],
			pt.x * m[1] + pt.y * m[3] + m[5]
		)
    },
    multiply: function(els) {
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
		this.elements = [
            a1 * a2 + c1 * b2,
            b1 * a2 + d1 * b2,
            a1 * c2 + c1 * d2,
            b1 * c2 + d1 * d2,
            a1 * e2 + c1 * f2 + e1,
            b1 * e2 + d1 * f2 + f1
		];

		return this;
    },
    elementsequal: function (a, b) {
        if (!a || !b) return false;
        return (
        a[0] == b[0] &&
        a[1] == b[1] &&
        a[2] == b[2] &&
        a[3] == b[3] &&
        a[4] == b[4] &&
        a[5] == b[5]);
    },
    save: function (els) {
        var h = this.history, last,
            k = typeof els === 'string' ? els : false;

        if (!els || k)
            els = this.elements;

        last = h.undo[h.undo.length - 1];

        if (!this.elementsequal(els, last)) {
            var l = h.undo.push(els.slice(0));
            h.redo = [];
            if (k)
                h.undo[k] = h.undo[l - 1];
        } else 
            if (k) {
                h.undo[k] = last;
            }
    },
    undo: function (k) {
        var h = this.history.undo,
            len = h.length,
            cur = h.pop(),
            prev = typeof k == 'string' ? h[k] : h[h.length - 1];
        
        if (cur)
            this.history.redo.unshift(cur);

        this.elements = prev ? prev.slice(0) : this.identity();
    },
    redo: function () {
        var h = this.history.redo, 
            len = h.length, 
            cur = h.pop(),
            prev = h[h.length - 1]
        
        if (cur)
            this.history.undo.unshift(cur);

        this.elements = prev ? prev.slice(0) : this.identity();
    },
    reset: function () {
        this.elements = this.identity();
        return this;
    },
    determinant: function () {
        var m = this.elements;
        return m[0] * m[3] - m[1] * m[2];
    },
	inverse: function() {

		var me = this.elements,
			m  = this.identity(),
			dt = this.determinant();

		if (dt < 1e-14)
			throw "Matrix not invertible.";

		m[0] = me[3] / dt;
		m[1] = -me[1] / dt;
		m[2] = -me[2] / dt;
		m[3] = me[0] / dt;
		m[4] = (me[2] * me[5] - me[3] * me[4]) / dt;
		m[5] = -(me[0] * me[5] - me[1] * me[4]) / dt;

		return new Matrix(m);
	},
	invert: function () {
        return this.multiply(this.inverse().elements);
	},
    identity: function () {
        return [1, 0, 0, 1, 0, 0];
    },
    isIdentity: function () {
        var m = this.elements;
        return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
    },
    translate: function (x, y) {
        if (x instanceof Point && !y)
            return this.multiply([1, 0, 0, 1, x.x, x.y]);

        return this.multiply([1, 0, 0, 1, x, y]);
    },
    scale: function (pt, s) {
        this.multiply([s, 0, 0, s, 0, 0]);
        var dp = pt.sub(pt.scale(s)).scale(1/s); // keep pt in same place after scale from origin
        return this.translate(dp);
    },
    rotateAboutPoint: function (pt, a) {
        var r = a * Math.PI / 180;
        return this.multiply([
            Math.cos(r),
            Math.sin(r),
            -Math.sin(r),
            Math.cos(r),
            pt.x - Math.cos(r) * pt.x - -Math.sin(r) * pt.y,
            pt.y - Math.sin(r) * pt.x - Math.cos(r) * pt.y
        ]);
    },
    rotate: function (a,b) {
        if (a instanceof Point)
            return this.rotateAboutPoint(a, b);

        var r = a * Math.PI / 180;
        return this.multiply([Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]);
    },
    normaldegree: function (r) {
        return r < 0 ? r + 360 : r;
    },
    rotation: function (norm) {
        var l = this.elements, r = Math.atan2(l[1], l[0]) * 180 / Math.PI;

        return norm ? this.normaldegree(r) : r;
    },
    scaling: function () {
        return Math.sqrt(Math.pow(this.elements[0], 2) + Math.pow(this.elements[1], 2))
    },
    translation: function () {
        return new Point(this.elements[4], this.elements[5]);
    }
}

export default Matrix;
