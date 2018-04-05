var Point = function (x, y) {
    if (typeof y == 'undefined')
        y = x;

    this.x = x;
    this.y = y;
}
Point.prototype = {
    scale: function (x) {
        return new Point(this.x*x, this.y*x)
    },
    round: function (x) {
        var x = x ? Math.pow(10, x) : 1;
        return new Point(Math.round(this.x * x) / x, Math.round(this.y * x) / x);
    },
    sub: function (m) {
        return new Point(this.x - m.x, this.y - m.y);
    },
    add: function (m) {
        return new Point(this.x + m.x, this.y + m.y);
    },
    mult: function (m) {
        return new Point(this.x * m.x, this.y * m.y);
    },
    divide: function (m) {
        return new Point(this.x / m.x, this.y / m.y);
    },
    nonzero: function () {
        return this.x != 0 || this.y != 0
    },
    equals: function (m) {
        return this.x === m.x && this.y === m.y
    },
    moreoreq: function (m) {
        return { x: this.x >= m.x, y: this.y >= m.y };
    },
    lessoreq: function (m) {
        return { x: this.x <= m.x, y: this.y <= m.y };
    },
    dot: function (m) {
        return this.x * m.x + this.y * m.y;
    },
    perpOnLine: function (p1, p2) {
        var
            k = ((p2.y - p1.y) * (this.x - p1.x) - (p2.x - p1.x) * (this.y - p1.y)) / (Math.pow(p2.y - p1.y,2) + Math.pow(p2.x - p1.x, 2)),
            x4 = this.x - k * (p2.y - p1.y),
            y4 = this.y + k * (p2.x - p1.x);

        return new Point(x4, y4);
    },
    mag: function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    } //,
    //toPos: function () {
    //    return new Pos(this.x, this.y);
    //}
}
