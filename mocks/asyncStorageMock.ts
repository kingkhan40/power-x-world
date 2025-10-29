// ✅ A fully typed AsyncStorage mock for web/Next.js

type StorageMap = Record<string, string>;

const storage: StorageMap = {};

const AsyncStorage = {
  async setItem(key: string, value: string): Promise<void> {
    storage[key] = value;
  },

  async getItem(key: string): Promise<string | null> {
    return storage[key] ?? null;
  },

  async removeItem(key: string): Promise<void> {
    delete storage[key];
  },

  async clear(): Promise<void> {
    (Object.keys(storage) as string[]).forEach((key: string) => delete storage[key]);
  },
};

export default AsyncStorage;
