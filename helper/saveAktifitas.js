const { ConflictCreateData } = require("../middlewares/errHandler");
const { saveAktifitasUser } = require("./Repository/aktifitasUser")

const saveAktifitas = (
    data = {
        userId: null, 
        reportId: null,
        aktifitas: null
    },
    transaction = null
) => {
    saveAktifitasUser(data, transaction).catch(error => {
        throw new ConflictCreateData("Gagal Menyimpan Data", error);
    })
}

module.exports = {
    saveAktifitas
}