import Size from './Size.js';
import Point from './Point.js';

class PolygonMath {
  static fitWithin(w, h, dw, dh) {
    const a = w / h;
    const da = dw / dh;
    return da > a ? new Size(dh * a, dh) : new Size(dw, dw / a);
  }

  static clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  static rotatePoly(points, deg, o) {
    return points.map(p => this.rotatePoint(p, o, deg));
  }

  static rotatePoint(p, o, deg) {
    const rad = deg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = cos * (p.x - o.x) - sin * (p.y - o.y) + o.x;
    const ry = sin * (p.x - o.x) + cos * (p.y - o.y) + o.y;
    return new Point(rx, ry);
  }

  static zoomRotate(points, deg) {
    // Not implemented
  }

  static normaliseAngle(deg) {
    let a = deg % 360;
    if (a < 0) a += 360;
    return a;
  }
}

export default PolygonMath;
