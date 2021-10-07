const { errorResponse, successResponse } = require('../../helper/Response');
const { getAllReport, getOneReport } = require('../../helper/DataReport');
const authentication = require('../../middlewares/Authentication');
const httpStatus = require('../../helper/Httplib');
const { createUserActivity } = require('../../helper/UserActivity');
const { countReportByType, countAllReport, getAllReportByType } = require('../../helper/DataReport');

const importExportTotal = (importExportValue, status = null) => {
    let returnValue = {};
        // Separate Import And Export 
    for (let i = 0; i < importExportValue.length; i++) {
        const element = importExportValue[i];
        returnValue[element.jenisPemberitahuan] = element.count;
    }
    if(!('Export' in returnValue)){
        returnValue['Export'] = "0";
    }
    if(!('Import' in returnValue)){
        returnValue['Import'] = "0";
    }
    if(status !== null){
        returnValue["status"] = status; 
    }
    
    return returnValue; 
}

const getCountReportByType = async (req, res) => {
    try {
        const {status} = req.query;

        const result = await countReportByType(status, req);

        try {
            // const temp = result.toJSON(result)
            const resultActivity = await createUserActivity(req.currentUser, null, "View Total Report By Type")
        } catch (error) {
            throw error;
        } finally {

        }

        const total = result[0]; 
        if(total.length == 0){
            return successResponse(res, httpStatus.ok, `Data With Status "${status}" Is Empty`);
        }

        return successResponse(res, httpStatus.ok, "", importExportTotal(total, status));
    } catch (error) {
        return errorResponse(res, httpStatus.badRequest, "Failed To Get Total Report Type Data")
    }
}

const getAll = async(req, res) => {
    try {
        const {pageSize, pageNo, sortBy, search, type} = req.query;
        const result = await getAllReport(req, pageSize, pageNo, sortBy, search, type);
        
        if(result.error) {
            throw new Error(result.error)
        }
        
        if(req.currentRole !== "Owner") {
            await createUserActivity(req.currentUser, reportId = null, "Viewing Data Report")
        }

        return successResponse(res, httpStatus.ok, "Success Viewing Data Report", result)
    } catch (err) {
        return errorResponse(res, httpStatus.internalServerError, err.message)
    }
}

const getOne = async (req, res) => {
    const {id} = req.params
    try {
        const result = await getOneReport(req, id);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, id, "View One Report");
        }

        return successResponse(res, httpStatus.ok, result);
    } catch (error) {
        console.error(error)
        return errorResponse(res, httpStatus.internalServerError, "Failed To Get Report");
    }
}

const getCode = (val) => {
    if(typeof val !== 'string'){
        val = ""+val;
    }

    if(!val.includes('-')){
        throw new Error('Value Doesnt Include "-"')
    }

    const split = val.split('-');
    return split[0].trim();
}

const removeSpace = (val) => {
    val = ""+val;
    return val.replace(/ /g, "");
}

const getXMLReport = async (req, res) => {
    const {id} = req.params;
    
    try {
        const result = await getOneReport(req, id);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, id, "View XML Format");
        }

        let xml = ``;
        const listBarang = result.listBarangs;

        for(let i = 0; i < listBarang.length; i++){
            xml += `<HEADER>`;
            xml += `<KD_KANTOR>${getCode(result.DataPengajuan.kantorPabeanAsal)}</KD_KANTOR>`;
            xml += `<KD_JNS_ANGKUT>${getCode(result.DataPengangkutan.caraAngkut)}</KD_JNS_ANGKUT>`;
            xml += `<NM_PENGANGKUT>${result.DataPengangkutan.namaPengangkut}</NM_PENGANGKUT>`;
            xml += `<NO_FLIGHT>${result.DataPengangkutan.nomorVoyFlightPol}</NO_FLIGHT>`;
            xml += `<KD_PEL_MUAT>${removeSpace(result.DataPelabuhanMuatBongkar.pelabuhanMuat)}</KD_PEL_MUAT>`;
            xml += `<NM_PENGIRIM>${result.IdentitasPengirim.namaPengirim}</NM_PENGIRIM>`;
            xml += `<AL_PENGIRIM>${result.IdentitasPengirim.alamatPengirim}</AL_PENGIRIM>`;
            xml += `<JNS_ID_PENERIMA>${getCode(result.reportIdentitasPenerima.jenisIdentitasPenerima)}</JNS_ID_PENERIMA>`;
            xml += `<NM_PENERIMA>${result.reportIdentitasPenerima.namaPenerima}</NM_PENERIMA>`;
            xml += `<AL_PENERIMA>${result.reportIdentitasPenerima.alamatPenerima}</AL_PENERIMA>`;
            xml += `<JNS_ID_PEMBERITAHU>${getCode(result.DataPengajuan.kategoryPemberitahuan)}</JNS_ID_PEMBERITAHU>`;
            xml += `<KD_VAL>${getCode(result.TransaksiPerdagangan.valuta)}</KD_VAL>`;
            xml += `<NDPBM>${result.TransaksiPerdagangan.kursNDPBM}</NDPBM>`;
            xml += `<FREIGHT>${result.TransaksiPerdagangan.freight}</FREIGHT>`;
            xml += `<CIF>${result.TransaksiPerdagangan.cif}</CIF>`;
            xml += `<DETIL>`;
            xml += `<BARANG>`;
            xml += `<HS_CODE>${listBarang[i].hsCode}</HS_CODE>`;
            xml += `<UR_BRG>${listBarang[i].uraian}</UR_BRG>`;
            xml += `</BARANG>`;
            xml += `</DETIL>`;
            xml += `</HEADER>`;
        }
        
        return successResponse(res, httpStatus.ok, "", xml);
    } catch (error) {
        console.error(error)
        return errorResponse(res, httpStatus.internalServerError, 'Failed Create XML Format');
    }
}

const getTotalReport = async (req, res) => {
    try {
        const result = await countAllReport(req);
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, "Viewing Total Report");
        }

        const total = result[0]

        return successResponse(res, httpStatus.ok, "", importExportTotal(total));
    } catch (error) {
        console.error(error);
        return errorResponse(res, httpStatus.internalServerError, 'Failed Get Total Report')
    }
}

const getDataActivityRedLine = async (req, res) => {
    try {
        const {pageSize, pageNo, type} = req.query;
        if(type === null || typeof type === 'undefined') {
            const result = await getAllReportByType(req, pageSize, pageNo);
            return successResponse(res, httpStatus.ok, "", result);
        }

        const result = await getAllReportByType(req, pageSize, pageNo, type);
        
        return successResponse(res, httpStatus.ok, "", result[0]);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, 'Failed To Fetch Red Line Activity');
    }
}

module.exports = (routes) => {
    routes.get('/', authentication, getAll);
    routes.get('/total', authentication, getCountReportByType);
    routes.get('/oneReport/:id', authentication, getOne);
    routes.get('/getXML/:id', authentication, getXMLReport);
    routes.get('/getTotalReport', authentication, getTotalReport);
    routes.get('/dataJalurMerah', authentication, getDataActivityRedLine);
}
