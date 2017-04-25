class MatrixData {
  static compute(m) {
    let matrix = [
      m.sx * Math.cos(m.a),
      m.sx * Math.sin(m.a),
      -m.sy * Math.sin(m.a),
      m.sy * Math.cos(m.a),
      m.x,
      m.y
    ];
    return "matrix(" + matrix.join(",") + ")";
  }

  static move(start, x, y) {
    let m = Object.assign({}, start);
    m.x += x;
    m.y += y;
    return m;
  }

  static rotate(start, a, x, y) {
    let m = Object.assign({}, start);
    m.x += x;
    m.y += y;
    m.a += a;
    return m;
  }

  static scale(start, x, y, sx, sy) {
    // console.log(sx,sy);
    if (isNaN(sx)|| isNaN(sy))
      console.log(sx,sy);
    let m = Object.assign({}, start);
    m.x += isNaN(x) ? 0 : x;
    m.y += isNaN(y) ? 0 : y;
    m.sx *= isNaN(sx) ? 0.999 : sx;
    m.sy *= isNaN(sy) ? 0.999 : sy;
    return m;
  }

}