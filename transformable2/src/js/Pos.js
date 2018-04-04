Pos = function (x, y) {
    if (typeof x != 'undefined')
        if (x.left) {
            y = x.top;
            x = x.left;
        }
    this.PosX = x;
    this.PosY = y;
}
Pos.prototype = {
    ToCSS: function (pixels) {
        var unit = pixels ? "px" : "%";
        return { top: this.PosY + unit, left: this.PosX + unit };
    },
    ToPercent: function (orig) {
        return new Pos(this.PosX / orig.PosX * 100, this.PosY / orig.PosY * 100);
    },
    SameVal: function (comp) {
        return this.PosY == comp.PosY && this.PosX == comp.PosX;
    },
    Mult: function (m) {
        if (typeof (m.PosX) == 'undefined')
            m = new Pos(m, m);
        return new Pos(this.PosX * m.PosX, this.PosY * m.PosY);
    },
    Divide: function (m) {
        if (typeof (m.PosX) == 'undefined')
            m = new Pos(m, m);
        return new Pos(this.PosX / m.PosX, this.PosY / m.PosY);
    },
    Sub: function (m) {
        if (typeof (m.PosX) == 'undefined')
            m = new Pos(m, m);
        return new Pos(this.PosX - m.PosX, this.PosY - m.PosY);
    },
    Add: function (m) {
        if (typeof (m.PosX) == 'undefined')
            m = new Pos(m, m);
        return new Pos(this.PosX + m.PosX, this.PosY + m.PosY);
    },
    ToSize: function () {
        return new Size(this.PosX, this.PosY);
    },
    Scale: function (x) {
        return new Pos(this.PosX * x, this.PosY * x);
    },
    Invert: function () {
        return new Pos(-this.PosX, -this.PosY);
    },
    TopLeftOf: function (x) {
        return new Pos(
            Math.min(this.PosX, x.PosX),
            Math.min(this.PosY, x.PosY)
        );
    },
    BotRightOf: function (x) {
        return new Pos(
            Math.max(this.PosX, x.PosX),
            Math.max(this.PosY, x.PosY)
        );
    },
    Diff: function (m) {
        return this.Sub(m);
    },

};
Pos.Pos1 = new Pos(1, 1);
Pos.Pos0 = new Pos(0, 0);
Pos.PosTL = new Pos(0, 0);
Pos.PosTR = new Pos(1, 0);
Pos.PosBL = new Pos(0, 1);
Pos.PosBR = new Pos(1, 1);
Pos.PosCT = new Pos(0.5, 0);
Pos.PosCR = new Pos(1, 0.5);
Pos.PosCB = new Pos(0.5, 1);
Pos.PosCL = new Pos(0, 0.5);
