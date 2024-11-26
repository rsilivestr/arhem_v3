function registerStorageItem<T>(key: string) {
  function setItem(value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function getItem(): T | null {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }
  function removeItem() {
    localStorage.removeItem(key);
  }
  return [getItem, setItem, removeItem] as const;
}

export const [getToken, setToken, removeToken] =
  registerStorageItem<string>('arhem3:token');

export const [getUsername, setUsername, removeUsername] =
  registerStorageItem<string>('arhem3:username');
