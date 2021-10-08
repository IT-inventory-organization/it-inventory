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
            xml += `<JNS_AJU></JNS_AJU>`;
            xml =+ `<KD_JNS_PIBK></KD_JNS_PIBK>`;
            xml += `<NO_BARANG></NO_BARANG>`;
            xml += `<NO_KANTONG></NO_KANTONG>`;
            xml += `<KD_KANTOR>${getCode(result.DataPengajuan.kantorPabeanAsal)}</KD_KANTOR>`;
            xml += `<KD_JNS_ANGKUT>${getCode(result.DataPengangkutan.caraAngkut)}</KD_JNS_ANGKUT>`;
            xml += `<NM_PENGANGKUT>${result.DataPengangkutan.namaPengangkut}</NM_PENGANGKUT>`;
            xml += `<NO_FLIGHT>${result.DataPengangkutan.nomorVoyFlightPol}</NO_FLIGHT>`;
            xml += `<KD_PEL_MUAT>${removeSpace(result.DataPelabuhanMuatBongkar.pelabuhanMuat)}</KD_PEL_MUAT>`;
            xml += `<KD_PEL_BONGKAR></KD_PEL_BONGKAR>`;
            xml += `<KD_GUDANG></KD_GUDANG>`;
            xml += `<TGL_INVOICE></TGL_INVOICE>`;
            xml += `<KD_NEGARA_ASAL></KD_NEGARA_ASAL>`;
            xml += `<JML_BRG></JML_BRG>`;
            xml += `<NO_BC11></NO_BC11>`;
            xml += `<TGL_BC11></TGL_BC11>`;
            xml += `<NO_POS_BC11></NO_POS_BC11>`;
            xml += `<NO_SUBPOS_BC11></NO_SUBPOS_BC11>`;
            xml += `<NO_SUBSUBPOS_BC11></NO_SUBSUBPOS_BC11>`;
            xml += `<NO_MASTER_BLAWB></NO_MASTER_BLAWB>`;
            xml += `<TGL_MASTER_BLAWB></TGL_MASTER_BLAWB>`;
            xml += `<NO_HOUSE_BLAWB></NO_HOUSE_BLAWB>`;
            xml += `<TGL_HOUSE_BLAWB></TGL_HOUSE_BLAWB>`;
            xml += `<KD_NEG_PENGIRIM></KD_NEG_PENGIRIM>`;
            xml += `<NM_PENGIRIM>${result.IdentitasPengirim.namaPengirim}</NM_PENGIRIM>`;
            xml += `<AL_PENGIRIM>${result.IdentitasPengirim.alamatPengirim}</AL_PENGIRIM>`;
            xml += `<JNS_ID_PENERIMA>${getCode(result.reportIdentitasPenerima.jenisIdentitasPenerima)}</JNS_ID_PENERIMA>`;
            xml += `<NO_ID_PENERIMA>0</NO_ID_PENERIMA>`;
            xml += `<NM_PENERIMA>${result.reportIdentitasPenerima.namaPenerima}</NM_PENERIMA>`;
            xml += `<AL_PENERIMA>${result.reportIdentitasPenerima.alamatPenerima}</AL_PENERIMA>`;
            xml += `<TELP_PENERIMA></TELP_PENERIMA>`;
            xml += `<JNS_ID_PEMBERITAHU>${getCode(result.DataPengajuan.kategoryPemberitahuan)}</JNS_ID_PEMBERITAHU>`;
            xml += `<NO_ID_PEMBERITAHU></NO_ID_PEMBERITAHU>`;
            xml += `<NM_PEMBERITAHU></NM_PEMBERITAHU>`;
            xml += `<AL_PEMBERITAHU></AL_PEMBERITAHU>`;
            xml += `<NO_IZIN_PEMBERITAHU></NO_IZIN_PEMBERITAHU>`;
            xml += `<TGL_IZIN_PEMBERITAHU></TGL_IZIN_PEMBERITAHU>`;
            xml += `<KD_VAL>${getCode(result.TransaksiPerdagangan.valuta)}</KD_VAL>`;
            xml += `<NDPBM>${result.TransaksiPerdagangan.kursNDPBM}</NDPBM>`;
            xml += `<FOB></FOB>`;
            xml += `<ASURANSI></ASURANSI>`;
            xml += `<FREIGHT>${result.TransaksiPerdagangan.freight}</FREIGHT>`;
            xml += `<CIF>${result.TransaksiPerdagangan.cif}</CIF>`;
            xml += `<NETTO></NETTO>`;
            xml += `<BRUTO></BRUTO>`;
            xml += `<TOT_DIBAYAR></TOT_DIBAYAR>`;
            xml += `<NPWP_BILLING></NPWP_BILLING>`;
            xml += `<NAMA_BILLING>helen </NAMA_BILLING>`;
            xml += `<HEADER_PUNGUTAN>`;
            xml += `<PUNGUTAN_TOTAL>`; // 1
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`;
            xml += `<NILAI></NILAI>`
            xml += `</PUNGUTAN_TOTAL>`; // 1
            xml += `<PUNGUTAN_TOTAL>`; // 2
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`;
            xml += `<NILAI></NILAI>`
            xml += `</PUNGUTAN_TOTAL>`; // 2
            xml += `<PUNGUTAN_TOTAL>`; // 3
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`;
            xml += `<NILAI></NILAI>`
            xml += `</PUNGUTAN_TOTAL>`; // 3
            xml += `<PUNGUTAN_TOTAL>`; // 4
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`;
            xml += `<NILAI></NILAI>`
            xml += `</PUNGUTAN_TOTAL>`; // 4
            xml += `</HEADER_PUNGUTAN>`;
            xml += `<DETIL>`;
            xml += `<BARANG>`;
            xml += `<SERI_BRG>1</SERI_BRG>`;
            xml += `<HS_CODE>${listBarang[i].hsCode}</HS_CODE>`;
            xml += `<UR_BRG>${listBarang[i].uraian}</UR_BRG>`;
            xml += `<KD_NEG_ASAL></KD_NEG_ASAL>`;
            xml += `<JML_KMS></JML_KMS>`;
            xml += `<JNS_KMS></JNS_KMS>`;
            xml += `<CIF></CIF>`;
            xml += `<KD_SAT_HRG></KD_SAT_HRG>`;
            xml += `<JML_SAT_HRG></JML_SAT_HRG>`;
            xml += `<FL_BEBAS></FL_BEBAS>`;
            xml += `<NO_SKEP></NO_SKEP>`;
            xml += `<TGL_SKEP></TGL_SKEP>`;
            xml += `<DETIL_PUNGUTAN>`;
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`;
            xml += `<NILAI></NILAI>`;
            xml += `<KD_TARIF></KD_TARIF>`;
            xml += `<KD_SAT_TARIF></KD_SAT_TARIF>`;
            xml += `<JML_SAT></JML_SAT>`;
            xml += `<TARIF></TARIF>`;
            xml += `</DETIL_PUNGUTAN>`
            xml += `<DETIL_PUNGUTAN>`;
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`;
            xml += `<NILAI></NILAI>`;
            xml += `KD_TARIF></KD_TARIF>`;
            xml += `<KD_SAT_TARIF></KD_SAT_TARIF>`;
            xml += `<JML_SAT></JML_SAT>`;
            xml += `<TARIF></TARIF>`;
            xml += `</DETIL_PUNGUTAN>`;
            xml += `<DETIL_PUNGUTAN>`;
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`
            xml += `<NILAI></NILAI>`;
            xml += `<KD_TARIF></KD_TARIF>`;
            xml += `<KD_SAT_TARIF></KD_SAT_TARIF>`;
            xml += `<JML_SAT></JML_SAT>`;
            xml += `<TARIF></TARIF>`;
            xml += `</DETIL_PUNGUTAN>`;
            xml += `<DETIL_PUNGUTAN>`;
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`
            xml += `<NILAI></NILAI>`;
            xml += `<KD_TARIF></KD_TARIF>`;
            xml += `<KD_SAT_TARIF></KD_SAT_TARIF>`;
            xml += `<JML_SAT></JML_SAT>`;
            xml += `<TARIF></TARIF>`;
            xml += `</DETIL_PUNGUTAN>`;
            xml += `<DETIL_PUNGUTAN>`;
            xml += `<KD_PUNGUTAN></KD_PUNGUTAN>`
            xml += `<NILAI></NILAI>`;
            xml += `<KD_TARIF></KD_TARIF>`;
            xml += `<KD_SAT_TARIF></KD_SAT_TARIF>`;
            xml += `<JML_SAT></JML_SAT>`;
            xml += `<TARIF></TARIF>`;
            xml += `</DETIL_PUNGUTAN>`;
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
