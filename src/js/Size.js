import Point from './Point.js';

class Size {
  constructor(w, h) {
    if (typeof w === 'object') {
      this.Width = w.Width;
      this.Height = w.Height;
    } else {
      if (typeof h === 'undefined') h = w;
      this.Width = w;
      this.Height = h;
    }
  }

  Aspect() {
    return this.Width / this.Height;
  }

  Mult(m) {
    if (typeof m.Width === 'undefined') m = new Size(m, m);
    return new Size(this.Width * m.Width, this.Height * m.Height);
  }

  Divide(m) {
    if (typeof m.Width === 'undefined') m = new Size(m, m);
    return new Size(this.Width / m.Width, this.Height / m.Height);
  }

  Sub(m) {
    if (typeof m.Width === 'undefined') m = new Size(m, m);
    return new Size(this.Width - m.Width, this.Height - m.Height);
  }

  Add(m) {
    if (typeof m.Width === 'undefined') m = new Size(m, m);
    return new Size(this.Width + m.Width, this.Height + m.Height);
  }

  ToCSS(pixels) {
    const unit = pixels ? 'px' : '%';
    return { width: this.Width + unit, height: this.Height + unit };
  }

  ToPercent(orig) {
    return new Size(this.Width / orig.Width * 100, this.Height / orig.Height * 100);
  }

  ToQueryString() {
    // String.format is not standard JS, so use template literals
    return `w=${this.Width}&h=${this.Height}`;
  }

  Round(d) {
    if (!d && d !== 0) return this;
    let f = 10;
    if (d === 0) { f = 1; d = 1; }
    return new Size(
      Math.round(this.Width * (d * f)) / (d * f),
      Math.round(this.Height * (d * f)) / (d * f)
    );
  }

  RoundUp(to) {
    const h = Math.ceil(this.Height / to) * to;
    const w = h * this.Aspect();
    return new Size(w, h);
  }

  Equals(comp) {
    return this.Width === comp.Width && this.Height === comp.Height;
  }

  // LessThan(comp) {
  //   return this.Width < comp.Width;
  // }

  SwapSign() {
    return new Size(-this.Width, -this.Height);
  }

  // ToPos() {
  //   return new Pos(this.Width, this.Height);
  // }

  Scale(x) {
    return new Size(this.Width * x, this.Height * x);
  }

  BiggerOrEqual(x) {
    return this.Width * this.Height >= x.Width * x.Height;
  }

  SwapVals(r) {
    if (!r) return new Size(this.Height, this.Width);
    if (r % 180 === 0) return this;
    if (r % 90 === 0) return new Size(this.Height, this.Width);
    return this;
  }

  IsValid() {
    return !(this.Width == null || isNaN(this.Width) || this.Height == null || isNaN(this.Height));
  }

  BiggestDim() {
    return Math.max(this.Width, this.Height);
  }

  static get Size0() { return new Size(0, 0); }
  static get Size05() { return new Size(0.5, 0.5); }
  static get Size1() { return new Size(1, 1); }
  static get Size2() { return new Size(2, 2); }
  static get Size3() { return new Size(3, 3); }
  static get Size4() { return new Size(4, 4); }
  static get Size5() { return new Size(5, 5); }
  static get Size6() { return new Size(6, 6); }
  static get Size100() { return new Size(100, 100); }
}

export default Size;
