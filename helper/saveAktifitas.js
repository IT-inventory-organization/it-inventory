const { ConflictCreateData } = require("../middlewares/errHandler");
const { saveAktifitasUser } = require("./Repository/aktifitasUser")

const saveAktifitas = (
    data = {
        userId: null, 
        reportId: null,
        aktifitas: null
    },
    transaction = null,
    req = null
) => {
    saveAktifitasUser(data, transaction, req).catch(error => {
        console.log(error);
    })
}

module.exports = {
    saveAktifitas
}