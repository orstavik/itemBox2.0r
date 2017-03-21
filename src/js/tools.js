/**
 * Created by orstavik on 15.03.17.
 */
class Tools {

  static merge0(A, B) {
    return A === B || !B || Object.keys(B).length === 0 ? A : B;
  }

  static merge1(A, B) {
    if (A === B) return A;
    if (!B || Object.keys(B).length === 0) return A;
    if (!A || Object.keys(A).length === 0) return B;
    return Object.assign({}, A, B);
  }

  static merge2(A, B) {
    if (A === B) return A;
    if (!B || Object.keys(B).length === 0) return A;
    if (!A || Object.keys(A).length === 0) return B;
    const C = Object.assign({}, A);
    for (let key of Object.keys(B))
      C[key] = Tools.merge1(A[key], B[key]);
    return C;
  }

  static mergeByFindingTheLongestArray(A, B) {
    if (A === B) return A;
    if (!B || B.length === 0) return A;
    if (!A || A.length === 0) return B;
    //todo only checking the length here!!
    return A.length > B.length ? A : B;
  }

  //it should remove all branches from A that is already in B
  //todo make it immutable
  //todo make this general and multilevel
  static filter1Level(A, B) {
    for (let key of Object.keys(B)) {
      let b = B[key];
      let a = A[key];
      if (!a)
        continue;
      for (let s of Object.keys(b)) {
        if (JSON.stringify(b[s]) === JSON.stringify(a[s]))
          delete a[s];
      }
    }
  }

  /**
   * Flattens a normal object tree. Does not work with arrays.
   *
   *     let tree = {a: {x: 1}, b: {y: {"12": "something"}}};
   *     let flatTree = State.flatten(tree, ".");
   *     flatTree == {"a.x" : 1, "b.y.12": "something"}; //true
   *
   * @param normalObject object to be flattened
   * @param separator "." for json, "/" for firebase
   * @returns a new flattened object with paths as keys.
   */
  static flatten(normalObject, separator) {
    const result = {};
    Tools._flattenImpl(normalObject, "", separator, result);
    return result;
  }

  static _flattenImpl(obj, startPath, separator, flattenedObject) {
    if (obj instanceof Object) {
      for (let childPath of Object.keys(obj))
        Tools._flattenImpl(obj[childPath], startPath + separator + childPath, separator, flattenedObject);
    } else
      flattenedObject[startPath] = obj;
  }

  /**
   * adds a startPath to all keys
   *
   * let flat = {"a/b": 1, c: 2, "xyz/12": 3};
   * let extendedFlat = State.extendKeys("new/root/", flat);
   * extendedFlat == {"new/root/a/b": 1, "new/root/c": 2, "new/root/xyz/12": 3}; //true
   *
   * @param {string} startPath
   * @param object a flattened object is probably best
   * @returns a new object with extended key names.
   */
  static extendKeys(startPath, object) {
    let result = {};
    for (let key of Object.keys(object))
      result[startPath + key] = object[key];
    return result;
  }
}