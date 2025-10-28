// Simple shim for web (Next.js)
const AsyncStorage = {
  getItem: async (key: string) => null,
  setItem: async (key: string, value: string) => {},
  removeItem: async (key: string) => {},
  clear: async () => {},
};

export default AsyncStorage;
