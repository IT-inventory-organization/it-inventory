const CryptoJS = require('crypto-js');
const config = require("../config")
const configSecurity = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
};
const keyPromise = CryptoJS.enc.Utf8.parse(config.get("KEY_ENCRYPT"));

module.exports = {
  AESDecrypt: (data) => {
    const convertToBase64 = CryptoJS.enc.Base64.parse(data);
    const decrypt = CryptoJS.AES.decrypt(
      {
        ciphertext: convertToBase64,
        salt: ''
      },
      keyPromise,
      configSecurity
    );
    return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
  },
  AESEncrypt: (data) => {
    const message = JSON.stringify(data);
    return CryptoJS.AES.encrypt(message, keyPromise, configSecurity).toString();
  },
  Base64: (clientId, clientSecret) => {
    // eslint-disable-next-line no-buffer-constructor
    const encodedData = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return `Basic ${encodedData}`;
  }
};
