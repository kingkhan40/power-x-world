// src/utils/asyncStorageShim.ts
const asyncStorageShim = {
  getItem: async (_key: string) => null,
  setItem: async (_key: string, _value: string) => {},
  removeItem: async (_key: string) => {},
  clear: async () => {},
};

export default asyncStorageShim;
