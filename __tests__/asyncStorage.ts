import * as AsyncStorage from '../src/asyncStorage';

const KEY_1 = 'key1';
const VALUE_1 = 'value1';

const KEY_2 = 'key2';
const VALUE_2 = 'value2';

const ERROR_KEY = 'ERROR_KEY';
const ERROR_VALUE = '!@#$!*!*@()#';

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

  it("should fire it's callback properly", async () => {
    await AsyncStorage.setItem(KEY_2, VALUE_1);
    AsyncStorage.setItem(KEY_2, VALUE_2, () => {
      expect(AsyncStorage.getItem(KEY_2)).resolves.toEqual(VALUE_2);
    });
  });

  it('should have the proper keys when checked', () => {
    expect(AsyncStorage.getAllKeys()).resolves.toEqual([KEY_1, KEY_2]);
  });

  it('should be able to multiSet', () => {
    AsyncStorage.multiSet([[KEY_1, VALUE_2], [KEY_2, VALUE_1]], () => {
      AsyncStorage.getItem(KEY_1, (error, result) =>
        expect(result).toEqual(VALUE_2),
      );
      expect(AsyncStorage.getItem(KEY_2)).resolves.toEqual(VALUE_1);
    });
  });

  it('should be able to multiGet', async () => {
    const combo = [[KEY_1, VALUE_1], [KEY_2, VALUE_2]];
    await AsyncStorage.multiSet(combo);
    expect(AsyncStorage.multiGet([KEY_1, KEY_2])).resolves.toEqual(combo);
  });

  it('should handle errors properly', () => {
    const testError = new Error('TEST ERROR');
    expect(AsyncStorage.getItem(ERROR_KEY)).rejects.toEqual(testError);
    AsyncStorage.getItem(ERROR_KEY, error => expect(error).toEqual(testError));
  });
});
