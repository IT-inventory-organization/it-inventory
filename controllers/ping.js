module.exports = (router) => {
    router.get('/', (req, res) => {
      const payload = { message: 'PONG' };

      res.status(200).json(payload);
    })
}