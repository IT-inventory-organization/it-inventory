const crypto = require('crypto');

module.exports = (routes) => {
    routes.get('/get', (req, res) => {
        return res.json({ 
            key_crypto: crypto.randomBytes(100).toString('base64'),
        })
    })
}