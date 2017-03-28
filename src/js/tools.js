/**
 * Created by ivar.orstavik and tom.phales 2017.
 */
class Tools {

  //returns an immutable copy of A with the branches of B either
  // - merged (if they differ) or
  // - nulled out in result (if B point null value).
  //
  //if either only B === null, then the branch will be deleted. (if the same criteria was set for A, it would be impossible to write in a new value for the same key later)
  //if either A or B === undefined or {} (empty object), then the other branch is used.
  static mergeDeepWithNullToDelete(A, B) {
    if (B === null) return null;
    if (B === undefined || Tools.emptyObject(B)) return A;
    if (A === undefined || Tools.emptyObject(A)) return B;
    if (A === B) return A;
    if (!(A instanceof Object && B instanceof Object)) return B;

    const C = Object.assign({}, A);
    let hasMutated = false;
    for (let key of Object.keys(B)) {
      const a = A[key];
      const b = B[key];
      let c = Tools.mergeDeepWithNullToDelete(a, b);
      if (c === a)
        continue;
      hasMutated = true;
      if (c === undefined)
        delete C[key];
      else
        C[key] = c;     //null is also set as a value in C
    }
    if (!hasMutated)
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

  //returns sets a value to object tree path,
  //if some part of that path is explicitly set to null,
  //then nothing is set and undefined is returned
  static setInNoCheck(obj, path, value) {
    let rootRes = Object.assign({}, obj);
    let res = rootRes;
    if (res === null) return undefined;
    for (let i = 0; i < path.length - 1; i++) {
      let key = path[i];
      res[key] = Object.assign({}, res[key]);
      res = res[key];
      if (res === null) return undefined;
    }
    res[path[path.length - 1]] = value;
    return rootRes;
  }

  /**
   * Immutable set function that acccepts null as wildcard in a path.
   * Because we have the wildcard function, no values will be set in the object if the path does not match.
   *
   * @param {object} obj the object in which the values are to be set
   * @param {object} path ["prop1", null, "prop2"] that path to the value to be set.
   *                 If one of the values are null, then all the properties at that level will be traversed
   * @param {object} value the value to be set. Try to use null and not undefined if you want to set something to nothing.
   * @returns a new object C with the new value(s) set. As few objects are cloned as possible.
   */
  static setInPathWithNullAsWildCard(obj, path, value) {
    if (path.length === 0)
      return value;
    if (obj === undefined)
      return undefined;
    if (obj === null)
      return obj;
    let res = Object.assign({}, obj);
    let key = path[0];
    if (key === null) {
      let mutated = false;
      for (let key of Object.keys(res)) {
        let newValue = Tools.setInPathWithNullAsWildCard(res[key], path.slice(1), value);
        if (newValue !== res[key]) {
          mutated = true;
          res[key] = newValue;
        }
      }
      return mutated ? res : obj;
    }
    let newValue = Tools.setInPathWithNullAsWildCard(res[key], path.slice(1), value);
    if (newValue === res[key])
      return obj;
    res[key] = newValue;
    return res;
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

  static pushIn(obj, path, value) {
    return Tools.setInNoCheck(obj, path.concat([(Tools.__pushCounter++)]), value);
  }

  /**
   * Immutable filter that strips out
   * 1) entries of A that are matching exactly entries in B
   * 2) all empty entries (with undefined or empty objects as value).
   *
   * @param {object} A the object to be filtered
   * @param {object} B the filter
   * @returns A if nothing is filtered away,
   *          undefined if A is empty or the whole content of A is filtered out by B,
   *          a new object C which is an immuted version of the partially filtered A.
   */
  static filterDeep(A, B) {
    console.log("WTF OMG!! Not tested Tools.filterDeep with null in the state");
    const noA = A === undefined || Tools.emptyObject(A);    //todo not tested for handling null
    const noB = B === undefined || Tools.emptyObject(B);    //todo not tested for handling null
    if (noA && noB) return undefined;
    if (noB) return A;
    if (noA) return undefined;
    if (A === B) return undefined;
    if (!(A instanceof Object && B instanceof Object)) return A;

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
    return A === undefined || A === null || this.emptyObject(A);
  }

  static emptyObject(A) {
    return A instanceof Object && Object.keys(A).length === 0;
  }

  //removes the
  static filterPath(obj, key, value) {
    const res = Object.assign({}, obj);
    if (key === null) {
      let hasFiltered = false;
      for (let key of Object.keys(res)) {
        if (res[key] === value) {
          hasFiltered = true;
          delete res[key];
        }
      }
      return hasFiltered ? res : obj;
    }
    if (res[key] === value) {
      delete res[key];
      return res;
    }
    return obj;
  }

  // static matchesPathValue(CC, ["shapes", null, "selected"], true);
  static matchesPathValue(obj, path, value) {
    if (!obj) return undefined;
    const key = path[0];
    if (path.length === 1) {
      if (key !== null) {
        if (obj[key] === value)
          return obj;
        return undefined;
      }
      const res = {};
      for (let key of Object.keys(obj)) {
        if (obj[key] === value)
          return obj;
      }
      return undefined;
    }
    const nextPath = path.slice(1);
    if (key !== null) {
      let child = Tools.matchesPathValue(obj[key], nextPath, value);
      if (child === undefined)
        return undefined;
      return obj;
    }
    let res = {};
    for (let key of Object.keys(obj)) {
      let child = Tools.matchesPathValue(obj[key], nextPath, value);
      if (child !== undefined)
        res[key] = child;
    }
    if (Object.keys(res).length)
      return res;
    return undefined;
  }

}
Tools.__pushCounter = 0;