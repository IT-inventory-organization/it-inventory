const CryptoJS = require('crypto-js');
const config = require("../config")
const configSecurity = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
};
const keyPromise = config.get("KEY_ENCRYPT");

module.exports = {
  AESDecrypt: (data) => {
    const decrypt = CryptoJS.AES.decrypt(
      data,
      keyPromise,
      configSecurity
    );
    return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
  },
  AESEncrypt: (data) => {
    const message = JSON.stringify(data);
    return CryptoJS.AES.encrypt(message, keyPromise, configSecurity).toString();
  },
};
