class State {
  constructor(viewPort, shapes) {
    this.shapes = shapes || {};
    this.viewPort = viewPort || {};
  }

  merge(B) {
    if (!B)
      return this;
    return new State(
      Tools.merge0(this.viewPort, B.viewPort),
      Tools.merge2(this.shapes, B.shapes)
    );
  }

  mergeShapes(shapes) {
    if (!shapes || Object.keys(shapes).length === 0)
      return this;
    return this.merge({shapes: shapes});
  }

  isEmpty() {
    return Object.keys(this.viewPort).length === 0 && Object.keys(this.shapes).length === 0;
  }
}