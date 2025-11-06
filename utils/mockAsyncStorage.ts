// Prevents runtime issues on web for MetaMask SDK
const AsyncStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
  clear: async () => {},
};
export default AsyncStorage;
