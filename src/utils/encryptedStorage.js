// store/encryptedStorage.ts
import { decryptData, encryptData } from "./encryption";

export const encryptedStorage = {
  getItem: async (key) => {
    const encryptedData = sessionStorage.getItem(key);
    if (!encryptedData) return null;
    return decryptData(encryptedData);
  },
  setItem: async (key, value) => {
    const encryptedValue = encryptData(value);
    sessionStorage.setItem(key, encryptedValue);
  },
  removeItem: async (key) => {
    sessionStorage.removeItem(key);
  },
};
