class Rectangle {
  static addCenter(rect) {
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      center: {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
      }
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
    return Rectangle.addCenter({left: left, top: top, right: right, bottom: bottom, width: width, height: height});
  }

  static makeFromTwoPoints(a, b) {
    return Rectangle.addCenter({
      left: a.x < b.x ? a.x : b.x,
      top: a.y < b.y ? a.y : b.y,
      right: a.x > b.x ? a.x : b.x,
      bottom: a.y > b.y ? a.y : b.y,
      width: Math.abs(a.x - b.x),
      height: Math.abs(a.y - b.y),
    });
  }

  static pointIsWithinBorders(box, p) {
    return p.x >= box.left && p.x <= box.right && p.y >= box.top && p.y <= box.bottom;
  }

  static calculateRotationMovement(center, sat, a) {
    let distX = sat.x - center.x;
    let distY = sat.y - center.y;
    return {
      x: distX * Math.cos(a) - distY * Math.sin(a) - distX,
      y: distX * Math.sin(a) + distY * Math.cos(a) - distY
    };
  }
}

class TransformableRectangle {
  static setup(rect, angle, sx, sy) {
    let res = Rectangle.addCenter(rect);
    res.scale = {
      x: sx / Math.abs(sx),
      y: sy / Math.abs(sy)
    };
    res.angle = angle;
    return res;
  }

  static makeFromManyRects(rects, matrix) {
    return TransformableRectangle.setup(Rectangle.union(rects), 0, matrix.sx, matrix.sy);
  }

  static makeFromSingleShape(rect, matrix) {
    let r = TransformableRectangle.calcRotatedRectangle(matrix.a, rect);
    return TransformableRectangle.setup(r, matrix.a, matrix.sx, matrix.sy);
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