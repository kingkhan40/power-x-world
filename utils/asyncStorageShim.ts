// A lightweight mock of AsyncStorage for web (MetaMask SDK compatibility)

const storage: Record<string, string> = {};

const AsyncStorage = {
  async setItem(key: string, value: string): Promise<void> {
    storage[key] = value;
  },
  async getItem(key: string): Promise<string | null> {
    return storage[key] || null;
  },
  async removeItem(key: string): Promise<void> {
    delete storage[key];
  },
  async clear(): Promise<void> {
    Object.keys(storage).forEach((key) => delete storage[key]);
  },
};

export default AsyncStorage;
