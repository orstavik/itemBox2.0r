class MatrixData {
  constructor(x, y, sx, sy, a) {
    this.x = x;
    this.sx = sx;
    this.sy = sy;
    this.y = y;
    this.a = a;
  }

  static random() {
    return new MatrixData(
      Math.random() * (window.innerWidth - 100) - window.innerWidth / 2 + 50,
      Math.random() * (window.innerHeight - 100) - window.innerHeight / 2 + 50,
      1,
      1,
      Math.random() * Math.PI * 2);
  }

  compute() {
    let matrix = [
      this.sx * Math.cos(this.a),
      this.sx * Math.sin(this.a),
      -this.sy * Math.sin(this.a),
      this.sy * Math.cos(this.a),
      this.x,
      this.y
    ];
    return "matrix(" + matrix.join(",") + ")";
  }

  clone() {
    return new MatrixData(this.x, this.y, this.sx, this.sy, this.a);
  }

  move(x,y){
    let res = this.clone();
    res.x+=x;
    res.y+=y;
    return res;
  }
}