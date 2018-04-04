var PolygonMath = {
    fitWithin: function (w, h, dw, dh) {
        var a = w / h,
            da = dw / dh,
            ns = da > a ? new Size(dh * a, dh) : new Size(dw, dw / a);
        return ns;
    },
    clamp: function (v, min, max) {
        return Math.min(max, Math.max(min, v));
    },
    rotatePoly: function (points, deg, o) {
        for (var i = 0; i < points.length; i++)
            points[i] = this.rotatePoint(points[i], o, deg);
        return points;
    },
    rotatePoint: function (p, o, deg) {
        var rx = (Math.cos(deg * Math.PI / 180) * (p.x - o.x)) - (Math.sin(deg * Math.PI / 180) * (p.y - o.y)) + o.x;
        var ry = (Math.sin(deg * Math.PI / 180) * (p.x - o.x)) + (Math.cos(deg * Math.PI / 180) * (p.y - o.y)) + o.y;
        return new Point(rx, ry);
    },
    zoomRotate: function (points, deg) {

    },
    normaliseAngle: function (deg) { var a = deg % 360; if (a < 0) a += 360; return a; }
}
