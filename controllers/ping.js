const Encrypt = require('../helper/encription');

module.exports = (router) => {
    router.get('/', (req, res) => {
      const payload = { message: 'PONG' };

      res.status(200).json(payload);
<<<<<<< HEAD
    }),
    router.post('/uid', (req, res) => {
      return res.json(Crypt.AESDecrypt(res.body.data));
  })
=======
    });

    router.post('/decrypt', (req, res) => {
      const Decrypt = Encrypt.AESDecrypt(req.body.data);
      return res.json(Decrypt).status(200);
    })
>>>>>>> 6d782c229cd74d123cf78a190c4a867db2cdc978
}