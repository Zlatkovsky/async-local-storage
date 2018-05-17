export function getItem(key: string, callback?: ICallbackWithResult) {
  return helperWithResult(() => window.localStorage.getItem(key), callback);
}

export function setItem(key: string, value: string, callback?: ICallback) {
  return helper(() => window.localStorage.setItem(key, value), callback);
}

export function removeItem(key: string, callback?: ICallback) {
  return helper(() => window.localStorage.removeItem(key), callback);
}

export function clear(callback?: ICallback) {
  return helper(() => window.localStorage.clear(), callback);
}

export function getAllKeys(
  callback?: (error?: Error, keys?: string[]) => void,
) {
  return helperWithResult(() => Object.keys(window.localStorage), callback);
}

export function mergeItem(key: string, value: string, callback?: ICallback) {
  throw new Error('Not implemented');
}

export function multiSet(
  keyValuePairs: string[][],
  callback?: (errors?: Error[]) => void,
) {
  return new Promise((resolve, reject) => {
    if (!callback) {
      callback = (errors?: Error[]) => {};
    }

    let errors: Error[];

    keyValuePairs.forEach(([key, value]) => {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        errors.push(e);
      }
    });

    callback(errors);

    if (errors) {
      reject(errors);
    } else {
      resolve();
    }
  });
}

export function multiGet(
  keys: string[],
  callback?: (errors?: Error[], result?: string[][]) => void,
) {
  return new Promise((resolve, reject) => {
    if (!callback) {
      callback = (errors?: Error[], result?: string[][]) => {};
    }

    let errors: Error[];

    const results = keys
      .map(key => {
        try {
          return [key, window.localStorage.getItem(key)];
        } catch (e) {
          errors.push(e);
        }
      })
      .filter(pair => pair);

    if (errors) {
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

function helper(
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

function helperWithResult(
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
