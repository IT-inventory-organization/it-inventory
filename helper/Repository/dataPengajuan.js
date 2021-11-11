const DokumenPemasukan = require("../../database/models/dokumen_pemasukan")

const saveDataPengajuan = async (data, transaction) => {
    try {
        const result = await DokumenPemasukan.create(data, {
            transaction,
            returning: true 
        });
        return result;
    } catch (error) {
        return false
    }
}

module.exports = {
    saveDataPengajuan
}