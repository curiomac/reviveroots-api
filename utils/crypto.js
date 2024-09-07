const CryptoJS = require("crypto-js");
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });
const secretKey = process.env.CRYPTO_SECRET;

const crypto = () => {
  console.log("process.env.CRYPTO_SECRET: ", secretKey);
  const encode = (data = "") => {
    if (!data) {
      throw new Error("No data provided for encryption.");
    }
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey
    ).toString();
    return encryptedData;
  };

  const decode = (encryptedData = "") => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

  return {
    encode,
    decode,
  };
};

module.exports = crypto;
