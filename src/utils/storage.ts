import Taro from '@tarojs/taro';

const STORAGE_PREFIX = 'heihua_';

export const storageKeys = {
  PROGRESS: `${STORAGE_PREFIX}progress`,
  MISTAKES: `${STORAGE_PREFIX}mistakes`,
  ACHIEVEMENTS: `${STORAGE_PREFIX}achievements`,
  DAILY_QUESTION: `${STORAGE_PREFIX}daily_question`,
  USER_SETTINGS: `${STORAGE_PREFIX}user_settings`,
  DAILY_STUDY: `${STORAGE_PREFIX}daily_study`
};

export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const res = Taro.getStorageSync(key);
    if (res === '' || res === null || res === undefined) {
      return defaultValue;
    }
    return typeof res === 'string' ? JSON.parse(res) : res;
  } catch (e) {
    console.error('[Storage] getStorage error:', key, e);
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    Taro.setStorageSync(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (e) {
    console.error('[Storage] setStorage error:', key, e);
  }
};

export const removeStorage = (key: string): void => {
  try {
    Taro.removeStorageSync(key);
  } catch (e) {
    console.error('[Storage] removeStorage error:', key, e);
  }
};
