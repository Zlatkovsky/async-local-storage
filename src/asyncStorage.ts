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
  throw new Error('Not implemented');
}

export function multiGet(
  keys: string[],
  callback?: (errors?: Error[], result?: string[][]) => void,
) {
  throw new Error('Not implemented');
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