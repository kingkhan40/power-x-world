// Dummy async storage for web
export const AsyncStorage = {
  getItem: async (_: string) => null,
  setItem: async (_: string, __: string) => {},
  removeItem: async (_: string) => {},
};
