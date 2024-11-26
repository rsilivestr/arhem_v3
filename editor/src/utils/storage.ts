function registerStorageItem<T>(key: string) {
  function setItem(value: T) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
  function getItem(): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }
  function removeItem() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  }
  return [getItem, setItem, removeItem] as const;
}

export const [getToken, setToken, removeToken] =
  registerStorageItem<string>('arhem3:token');

export const [getUsername, setUsername, removeUsername] =
  registerStorageItem<string>('arhem3:username');
