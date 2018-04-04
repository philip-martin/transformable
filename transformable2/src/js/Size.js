Size = function (w, h) {
    switch (typeof w) {
        case 'object':
            this.Width = w.Width;
            this.Height = w.Height;
            return;
            break;
        case 'number':
            if (typeof h == 'undefined') h = w;

    }
    this.Width = w;
    this.Height = h;
}
Size.prototype = {
    Aspect: function () { return this.Width / this.Height; },
    Mult: function (m) {
        if (typeof (m.Width) == 'undefined')
            m = new Size(m, m);
        return new Size(this.Width * m.Width, this.Height * m.Height);
    },
    Divide: function (m) {
        if (typeof (m.Width) == 'undefined')
            m = new Size(m, m);
        return new Size(this.Width / m.Width, this.Height / m.Height);
    },
    Sub: function (m) {
        if (typeof (m.Width) == 'undefined')
            m = new Size(m, m);
        return new Size(this.Width - m.Width, this.Height - m.Height);
    },
    Add: function (m) {
        if (typeof (m.Width) == 'undefined')
            m = new Size(m, m);
        return new Size(this.Width + m.Width, this.Height + m.Height);
    },
    ToCSS: function (pixels) {
        var unit = pixels ? "px" : "%";
        return { width: this.Width + unit, height: this.Height + unit };
    },
    ToPercent: function (orig) {
        return new Size(this.Width / orig.Width * 100, this.Height / orig.Height * 100);
    },
    ToQueryString: function () {
        return String.format('w={0}&amp;h={1}', this.Width, this.Height);
    },
    Round: function (d) {
        if (!d && d !== 0) return this;
        var f = 10;
        if (d == 0) { f = 1, d = 1 };
        return new Size(Math.round(this.Width * (d * f)) / (d * f), Math.round(this.Height * (d * f)) / (d * f))
    },
    RoundUp: function (to) {
        var h = Math.ceil(this.Height / to) * to,
            w = h * this.Aspect();
        return new Size(w, h);
    },
    Equals: function (comp) {
        return this.Width == comp.Width && this.Height == comp.Height;
    },
    //LessThan: function (comp) {
    //    return this.Width < comp.Width
    //},
    SwapSign: function () {
        return new Size(-this.Width, -this.Height);
    },
    ToPos: function () {
        return new Pos(this.Width, this.Height);
    },
    Scale: function (x) {
        return new Size(this.Width * x, this.Height * x);
    },
    BiggerOrEqual: function (x) {
        return this.Width * this.Height >= x.Width * x.Height;
    },
    SwapVals: function (r) {
        var ret = !r ? new Size(this.Height, this.Width) :
                r % 180 == 0 ? this : r % 90 == 0 ? new Size(this.Height, this.Width) : this;

        return ret;
    },
    IsValid: function () {
        return !(this.Width == null || isNaN(this.Width) || this.Height == null || isNaN(this.Height));
    },
    BiggestDim: function () {
        return Math.max(this.Width, this.Height);
    }
}
Size.Size0 = new Size(0, 0);
Size.Size05 = new Size(0.5, 0.5);
Size.Size1 = new Size(1, 1);
Size.Size2 = new Size(2, 2);
Size.Size3 = new Size(3, 3);
Size.Size4 = new Size(4, 4);
Size.Size5 = new Size(5, 5);
Size.Size6 = new Size(6, 6);
Size.Size100 = new Size(100, 100);
