const DokumenTambahan = require("../../database/models/dokumen_tambahan")

const saveDataTambahan = async(data, transaction) => {
    try {
        const result = await DokumenTambahan.create(data, {
            transaction: transaction
        })
        return result
    } catch (error) {
        return false
    }
}

module.exports = {
    saveDataTambahan
}