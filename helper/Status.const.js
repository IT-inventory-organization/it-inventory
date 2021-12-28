const { BadRequest } = require("../middlewares/errHandler");

class STATUS {
    static DISETUJUI = 'DISETUJUI';
    static MENUNGGU = 'MENUNGGU';
    static PERBAIKAN = 'PERBAIKAN';
}

const StatusCorrection = (req, status) => {
    const rMenuggu = /^(menunggu)/i;
    const rPerbaikan = /^(perbaikan)/i;
    const rDiSetujui = /^(disetujui)/i;

    let ReturnValue = "";
    switch (true) {
        case rMenuggu.test(status):
            ReturnValue = STATUS.MENUNGGU
            break;
        case rPerbaikan.test(status):
            ReturnValue = STATUS.PERBAIKAN    
            break;
        case rDiSetujui.test(status):
            ReturnValue = STATUS.DISETUJUI;
            break;
        default:
            throw new BadRequest('Input Tidak Valid', '', req);
    }

    return ReturnValue;
}

module.exports = {
    STATUS,
    StatusCorrection
};