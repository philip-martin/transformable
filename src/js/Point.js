class Point {
  constructor(x, y = x) {
    this.x = x;
    this.y = y;
  }

  scale(factor) {
    return new Point(this.x * factor, this.y * factor);
  }

  round(precision = 0) {
    const factor = precision ? Math.pow(10, precision) : 1;
    return new Point(
      Math.round(this.x * factor) / factor,
      Math.round(this.y * factor) / factor
    );
  }

  sub(p) {
    return new Point(this.x - p.x, this.y - p.y);
  }

  add(p) {
    return new Point(this.x + p.x, this.y + p.y);
  }

  mult(p) {
    return new Point(this.x * p.x, this.y * p.y);
  }

  divide(p) {
    return new Point(this.x / p.x, this.y / p.y);
  }

  nonzero() {
    return this.x !== 0 || this.y !== 0;
  }

  equals(p) {
    return this.x === p.x && this.y === p.y;
  }

  moreoreq(p) {
    return { x: this.x >= p.x, y: this.y >= p.y };
  }

  lessoreq(p) {
    return { x: this.x <= p.x, y: this.y <= p.y };
  }

  dot(p) {
    return this.x * p.x + this.y * p.y;
  }

  perpOnLine(p1, p2) {
    const k = ((p2.y - p1.y) * (this.x - p1.x) - (p2.x - p1.x) * (this.y - p1.y)) /
      (Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
    const x4 = this.x - k * (p2.y - p1.y);
    const y4 = this.y + k * (p2.x - p1.x);
    return new Point(x4, y4);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // toPos() {
  //   return new Pos(this.x, this.y);
  // }
}

export default Point;
