const AsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return typeof window !== "undefined" ? localStorage.getItem(key) : null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
};

export default AsyncStorage;
