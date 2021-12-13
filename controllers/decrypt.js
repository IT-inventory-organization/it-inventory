const Crypt = require('../helper/encription')

module.exports = routes => {
    routes.post('/', (req, res) => {
        return res.json(Crypt.AESDecrypt(req.body.data));
    })
}