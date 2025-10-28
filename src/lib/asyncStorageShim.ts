// src/utils/asyncStorageShim.ts
const AsyncStorage = {
  getItem: async (_key: string) => null,
  setItem: async (_key: string, _value: string) => {},
  removeItem: async (_key: string) => {},
};

export default AsyncStorage;
