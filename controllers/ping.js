const Encrypt = require('../helper/encription');

module.exports = (router) => {
    router.get('/', (req, res) => {
      const payload = { message: 'PONG' };

      res.status(200).json(payload);
    });

    router.post('/decrypt', (req, res) => {
      const Decrypt = Encrypt.AESDecrypt(req.body.data);
      return res.json(Decrypt).status(200);
    })
}