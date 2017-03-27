/**
 * Created by ivar.orstavik and tom.phales 2017.
 */
class Tools {

  static mergeDeep(A, B) {
    const noA = Tools.isNothing(A);
    const noB = Tools.isNothing(B);
    if (noA && noB) return undefined;
    if (noB) return A;
    if (noA) return B;
    if (A === B) return A;
    if (!(A instanceof Object && B instanceof Object)) return B;

    const C = Object.assign({}, A);
    let hasMerged = false;
    for (let key of Object.keys(B)) {
      const a = A[key];
      const b = B[key];
      let c = Tools.mergeDeep(a, b);
      if (c !== a)
        hasMerged = true;
      if (c !== undefined)
        C[key] = c;
    }
    if (!hasMerged)
      return A;
    if (Object.keys(C).length === 0)
      return undefined;
    return C;
  }

  /**
   * Flattens a normal object tree to an array of {path, value} objects
   * where path is an array of keys as strings. Only works with objects.
   *
   *     let tree = {a: {x: 1}, b: {y: {"12": "something"}}};
   *     let flatTree = Tools.flatten(tree);
   *     //[{path: ["a","x"], value: 1}, {path: ["b","y","12"], value: "something"}]
   *
   * @param object object to be flattened
   * @returns an array of [{path: <array>, value: ?}] for that object
   */
  static flatten(object) {
    const res = []; //mutable
    Tools._flattenImpl(object, [], res);
    return res;
  }

  static _flattenImpl(obj, path, res) {
    if (!(obj instanceof Object)) {
      res.push({path: path, value: obj});
      return;
    }
    for (let key of Object.keys(obj))
      Tools._flattenImpl(obj[key], path.concat([key]), res);
  }

  /**
   * adds a startPath to all keys
   *
   * let flat = {"a/b": 1, c: 2, "xyz/12": 3};
   * let extendedFlat = State.pathsToObject("new/root/", flat);
   * extendedFlat == {"new/root/a/b": 1, "new/root/c": 2, "new/root/xyz/12": 3}; //true
   *
   * @param flat an array of a flattened object
   * @param {string} startPath
   * @param {string} separator used between the elements of the path, such as "." or "/"
   * @returns a new object with extended key names.
   */
  static pathsToObject(flat, startPath, separator) {
    let result = {};
    for (let pathValue of flat)
      result[startPath + pathValue.path.join(separator)] = pathValue.value;
    return result;
  }

  static setIn(obj, path, value) {
    return Tools.getIn(obj, path) === value ? obj : Tools.setInNoCheck(obj, path, value);
  }

  static setInNoCheck(obj, path, value) {
    let rootRes = Object.assign({}, obj);
    let res = rootRes;
    for (let i = 0; i < path.length - 1; i++) {
      let key = path[i];
      res[key] = Object.assign({}, res[key]);
      res = res[key];
    }
    res[path[path.length - 1]] = value;
    return rootRes;
  }

  static getIn(obj, path) {
    if (!(obj instanceof Object)) return undefined;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      obj = obj[key];
      if (!(obj instanceof Object)) return undefined;
    }
    return obj[path[path.length - 1]];
  }

  static pushIn(obj, path, value){
    return Tools.setInNoCheck(obj, path.concat([(Tools.__pushCounter++)]), value);
  }

  /**
   * Immutable filter that strips out
   * 1) entries of A that are matching exactly entries in B
   * 2) all empty entries (with undefined or null as value).
   *
   * @param {object} A the object to be filtered
   * @param {object} B the filter
   * @returns A if nothing is filtered away,
   *          undefined if A is empty or the whole content of A is filtered out by B,
   *          a new object C which is an immuted version of the partially filtered A.
   */
  static filterDeep(A, B) {
    const noA = Tools.isNothing(A);
    const noB = Tools.isNothing(B);
    if (noA && noB) return undefined;
    if (noB) return A;
    if (noA) return undefined;
    if (A === B) return undefined;
    if (!(A instanceof Object && B instanceof Object)) return A;
    // if (A === B) return undefined;
    // if (B === undefined) return A;
    // if (!(A instanceof Object) || !(B instanceof Object)) return A;
    // if (Object.keys(A).length === 0) return undefined;

    const C = {};
    let hasFiltered = false;
    for (let key of Object.keys(A)) {
      const a = A[key];
      const b = B[key];
      let c = Tools.filterDeep(a, b);
      if (c !== a)
        hasFiltered = true;
      if (c !== undefined)
        C[key] = c;
    }
    if (!hasFiltered)
      return A;
    if (Object.keys(C).length === 0)
      return undefined;
    return C;
  }

  static isNothing(A) {
    return A === undefined || A === null || (A instanceof Object && Object.keys(A).length === 0);
  }
}

Tools.__pushCounter = 0;