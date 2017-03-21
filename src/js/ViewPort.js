class ViewPort {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
  }

  move(x, y) {
    return new ViewPort(this.x + x, this.y + y, this.s);
  }

  zoom(ds, ex, ey){
    let xShift = (ex - this.x) * (1 - ds);
    let yShift = (ey - this.y) * (1 - ds);
    return new ViewPort(this.x + xShift, this.y + yShift, this.s * ds);
  }
}