// utils/encryption.ts
import CryptoJS from "crypto-js";

const SECRET_KEY = "tu-clave-secreta"; // Cambia esto y guárdalo en variables de entorno

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
