const Crypt = require('../helper/encription')
const config = require('../config.json');
const STAGEAPP = require('../helper/Stage.interface');

module.exports = routes => {
    routes.post('/', (req, res) => {
        if(config.STAGE == STAGEAPP.DEVELOPMENT){
            return res.json(Crypt.AESDecrypt(req.body.data));
        }
    })
}