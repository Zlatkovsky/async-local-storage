class LocalStorageMock {
  constructor() {
    this.store = {};

    var oldObjKeys = Object.keys;
    Object.keys = arg =>
      oldObjKeys(arg instanceof LocalStorageMock ? arg.store : arg);
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();
