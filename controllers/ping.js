module.exports = (router) => {
    router.get('/', (req, res) => {
      const payload = { message: 'PONG' };

      res.status(200).json(payload);
    }),
    router.post('/uid', (req, res) => {
      return res.json(Crypt.AESDecrypt(res.body.data));
  })
}