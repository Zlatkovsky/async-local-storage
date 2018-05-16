import * as AsyncStorage from '../src/asyncStorage';

const KEY_1 = 'key1';
const VALUE_1 = 'value1';

describe('AsyncStorage', () => {
  it('should be able to clear', () => {
    expect(AsyncStorage.clear()).resolves.toEqual(undefined);
    expect(AsyncStorage.getAllKeys()).resolves.toEqual([]);
  });
  it('should be able to set a value', () => {
    expect(AsyncStorage.setItem(KEY_1, VALUE_1)).resolves.toEqual(undefined);
  });
  it('should be able to get a value', () => {
    expect(AsyncStorage.getItem(KEY_1)).resolves.toEqual(VALUE_1);
  });
});
