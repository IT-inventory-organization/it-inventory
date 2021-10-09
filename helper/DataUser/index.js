const User = require('../../database/models/user');

const getOneUserData = async (req, idUser) => {
    try {
        const user = await User.findOne({
            where: {
                id: idUser
            },
            attributes: ['npwp', 'address', 'name']
        })
        // console.log('im in')
        return user
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getOneUserData
}