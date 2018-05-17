export function getItem(key: string, callback?: ICallbackWithResult) {
  return performActionAndReturnResult(
    () => window.localStorage.getItem(key),
    callback,
  );
}

export function setItem(key: string, value: string, callback?: ICallback) {
  return performAction(() => window.localStorage.setItem(key, value), callback);
}

export function removeItem(key: string, callback?: ICallback) {
  return performAction(() => window.localStorage.removeItem(key), callback);
}

export function clear(callback?: ICallback) {
  return performAction(() => window.localStorage.clear(), callback);
}

export function getAllKeys(
  callback?: (error?: Error, keys?: string[]) => void,
) {
  return performActionAndReturnResult(
    () => Object.keys(window.localStorage),
    callback,
  );
}

export function mergeItem(key: string, value: string, callback?: ICallback) {
  throw new Error('Not implemented');
}

export function multiSet(
  keyValuePairs: string[][],
  callback?: (errors?: Error[]) => void,
) {
  return performMultiAction(
    keyValuePairs,
    ([key, value]) => window.localStorage.setItem(key, value),
    callback,
  );
  // return new Promise((resolve, reject) => {
  //   if (!callback) {
  //     callback = (errors?: Error[]) => {};
  //   }

  //   let errors: Error[];

  //   keyValuePairs.forEach(([key, value]) => {
  //     try {
  //       window.localStorage.setItem(key, value);
  //     } catch (e) {
  //       errors.push(e);
  //     }
  //   });

  //   callback(errors);

  //   if (errors) {
  //     reject(errors);
  //   } else {
  //     resolve();
  //   }
  // });
}

export function multiRemove(
  keys: string[],
  callback?: (errors?: Error[]) => void,
) {
  return performMultiAction(
    keys,
    key => window.localStorage.removeItem(key),
    callback,
  );
}

export function multiGet(
  keys: string[],
  callback?: (errors?: Error[], result?: string[][]) => void,
) {
  return new Promise((resolve, reject) => {
    if (!callback) {
      callback = (errors?: Error[], result?: string[][]) => {};
    }

    let errors: Error[] = [];

    const results = keys
      .map(key => {
        try {
          return [key, window.localStorage.getItem(key)];
        } catch (e) {
          errors.push(e);
        }
      })
      .filter(pair => pair);

    if (errors.length > 0) {
      callback(errors, results);
      reject(errors);
    } else {
      callback(null, results);
      resolve(results);
    }
  });
}

// helpers

type ICallback = (error?: Error) => void;
type ICallbackWithResult = (error?: Error, result?: string) => void;

const defaultCallback: ICallback = (error?: Error) => {};
const defaultCallbackWithResult: ICallbackWithResult = (
  error?: Error,
  result?: string,
) => {};

function performAction(
  action: () => void,
  callback: ICallback = defaultCallback,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      action();
      callback(null);
      resolve();
    } catch (e) {
      callback(e);
      reject(e);
    }
  });
}

function performActionAndReturnResult(
  action: () => any,
  callback: any = defaultCallbackWithResult,
) {
  return new Promise((resolve, reject) => {
    try {
      const result = action();
      callback(null, result);
      resolve(result);
    } catch (e) {
      callback(e, null);
      reject(e);
    }
  });
}

function performMultiAction(
  collection: any[],
  action: Function,
  callback: any = defaultCallback,
) {
  return new Promise((resolve, reject) => {
    let errors: Error[] = [];

    collection.forEach(item => {
      try {
        action(item);
      } catch (e) {
        errors.push(e);
      }
    });

    callback(errors);

    if (errors.length > 0) {
      reject(errors);
    } else {
      resolve();
    }
  });
}
