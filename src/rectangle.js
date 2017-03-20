class Rectangle {
  constructor(rect) {
    this.left = rect.left;
    this.right = rect.right;
    this.top = rect.top;
    this.bottom = rect.bottom;
    this.width = rect.width;
    this.height = rect.height;
    this.center = {
      x: (this.left + this.right) / 2,
      y: (this.top + this.bottom) / 2
    };
  }

  static union(rects) {
    let left, top, right, bottom, width, height;
    for (let rect of rects) {
      if (!left || left > rect.left)
        left = rect.left;
      if (!top || top > rect.top)
        top = rect.top;
      if (!right || right < rect.right)
        right = rect.right;
      if (!bottom || bottom < rect.bottom)
        bottom = rect.bottom;
    }
    width = right - left;
    height = bottom - top;
    return new Rectangle({left: left, top: top, right: right, bottom: bottom, width: width, height: height});
  }

  static makeFromTwoPoints(a, b) {
    return new Rectangle({
      left: a.x < b.x ? a.x : b.x,
      top: a.y < b.y ? a.y : b.y,
      right: a.x > b.x ? a.x : b.x,
      bottom: a.y > b.y ? a.y : b.y,
      width: Math.abs(a.x - b.x),
      height: Math.abs(a.y - b.y),
    });
  }

  pointIsWithinBorders(p) {
    return p.x >= this.left && p.x <= this.right && p.y >= this.top && p.y <= this.bottom;
  }
}

class TransformableRectangle extends Rectangle {
  constructor(rect, angle, sx, sy) {
    super(rect);
    this.scale = {
      x: sx / Math.abs(sx),
      y: sy / Math.abs(sy)
    };
    this.angle = angle;
  }

  static makeFromManyRects(rects, matrix) {
    return new TransformableRectangle(Rectangle.union(rects), 0, matrix.sx, matrix.sy);
  }

  static makeFromSingleShape(rect, matrix) {
    let r = TransformableRectangle.calcRotatedRectangle(matrix.a, rect);
    return new TransformableRectangle(r, matrix.a, matrix.sx, matrix.sy);
  }

  static calcRotatedRectangle(angle, rect) {
    let wh = TransformableRectangle.calculateRotatedWidthAndHeight(angle, rect.width, rect.height);
    return {
      left: rect.left + (rect.width - wh.width) / 2,
      top: rect.top + (rect.height - wh.height) / 2,
      right: rect.right - (rect.width - wh.width) / 2,
      bottom: rect.bottom - (rect.height - wh.height) / 2,
      width: wh.width,
      height: wh.height
    };
  }

  static calculateRotatedWidthAndHeight(angle, w, h) {
    if (angle % Math.PI === 0)
      return {width: w, height: h};

    if (angle % Math.PI === Math.PI / 2)
      return {width: h, height: w};

    let sin = Math.abs(Math.sin(angle));
    let cos = Math.abs(Math.cos(angle));
    return {
      width: (w / sin - h / cos) / (cos / sin - sin / cos),
      height: (w / cos - h / sin) / (sin / cos - cos / sin)
    };
  }
}