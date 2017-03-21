class State {
  constructor(viewPort, shapes, systemMessages, helpMessages) {
    this.shapes = shapes || {};
    this.viewPort = viewPort || {};
    this.helpMessages = helpMessages || [];
    this.systemMessages = systemMessages || [];
  }

  merge(B) {
    if (!B)
      return this;
    return new State(
      Tools.merge0(this.viewPort, B.viewPort),
      Tools.merge2(this.shapes, B.shapes),
      Tools.mergeByFindingTheLongestArray(this.systemMessages, B.systemMessages),
      Tools.mergeByFindingTheLongestArray(this.helpMessages, B.helpMessages)
    );
  }

  mergeShapes(shapes) {
    if (!shapes || Object.keys(shapes).length === 0)
      return this;
    return this.merge({shapes: shapes});
  }

  pushHelpMessage(msg){
    return new State(this.viewPort, this.shapes, this.helpMessages.concat([msg]), this.systemMessages);
  }

  pushSystemMessage(msg){
    return new State(this.viewPort, this.shapes, this.helpMessages, this.systemMessages.concat([msg]));
  }

  isEmpty() {
    return Object.keys(this.viewPort).length === 0 && Object.keys(this.shapes).length === 0;
  }
}