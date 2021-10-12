const { errorResponse, successResponse } = require('../../helper/Response');
const { getAllReport, getOneReport } = require('../../helper/DataReport');
const authentication = require('../../middlewares/authentication');
const httpStatus = require('../../helper/Httplib');
const sequelize = require('../../configs/database')
const { createUserActivity } = require('../../helper/UserActivity');
const { countReportByType, countAllReport, getAllReportByType, getPerTable, getPerTableBarangDokumen } = require('../../helper/DataReport');
const reportDataPengajuan = require('../../database/models/datapengajuan');
const reportIdentitasPenerima = require('../../database/models/identitaspenerima');
const reportIdentitasPengirim = require('../../database/models/identitaspengirim');
const reportTransaksiPerdagangan = require('../../database/models/transaksiperdagangan');
const reportDataPengangkutan = require('../../database/models/datapengangkutan');
const reportDataPelabuhanMuatBongkar = require('../../database/models/datapelabuhanmuatbongkar');
const reportDataBeratDanVolume = require('../../database/models/databeratdanvolume');
const reportDataPetiKemasDanPengemas = require('../../database/models/datapetikemasdanpengemas');
const reportDataTempatPenimbunan = require('../../database/models/datatempatpenimbunan');
const reportDataPerkiraanTanggalPengeluaran = require('../../database/models/dataperkiraantanggalpengeluaran');
const reportListBarang = require('../../database/models/listbarang');
const reportListDokumen = require('../../database/models/listdokumen');
const reportDataPetiKemas = require('../../database/models/datapetikemas');
const {getOneUserData} = require('../../helper/DataUser')

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

        const {pageSize, pageNo, sortBy, search, type, status} = req.query;
        const result = await getAllReport(req, pageSize, pageNo, sortBy, search, type, status);
        
        if(result.error) {
            throw new Error(result.error)
        }
        
        if(req.currentRole !== "Owner") {
            await createUserActivity(req.currentUser, reportId = null, "Viewing All Data Report")
        }

        return successResponse(res, httpStatus.ok, "Success Viewing Data Report", result)
    } catch (err) {
        return errorResponse(res, httpStatus.internalServerError, err.message)
    }
}

const convertDate = (date) => {
    const ISO = new Date(date);
    return `${addZero(ISO.getDate())}-${addZero(ISO.getMonth()+1)}-${ISO.getFullYear()}`;
}

const addZero = (val) => {
    if(val < 10){
        return `0${val}`
    }

    return val
}

const getOne = async (req, res) => {
    const {id} = req.params
    try {
        
        const result = await getOneReport(req, id);

        const data = result.toJSON();

        data.DataPerkiraanTanggalPengeluaran.perkiraanTanggalPengeluaran = convertDate(data.DataPerkiraanTanggalPengeluaran.perkiraanTanggalPengeluaran);
        data.IdentitasPengirim.tanggalIjinBpkPengirim = convertDate(data.IdentitasPengirim.tanggalIjinBpkPengirim);

        for (let i = 0; i < data.ListDokumens.length; i++) {
            data.ListDokumens[i].tanggalDokumen = convertDate(data.ListDokumens[i].tanggalDokumen);       
        }

        // Remove
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, id, "View One Report");
        }

        return successResponse(res, httpStatus.ok, "", data);
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
        return val
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

        let xml = ``;

        const listBarang = result.listBarangs;

        for(let i = 0; i < listBarang.length; i++){
            xml += `<HEADER>`;
            xml += `<JNS_AJU></JNS_AJU>`;
            xml += `<KD_JNS_PIBK></KD_JNS_PIBK>`;
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
            xml += `<SERI_BRG></SERI_BRG>`;
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

        // Remove
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, id, "Viewing XML Format");
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

        // Remove
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, "Viewing Total Report");
        }

        const total = result[0];

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
            return successResponse(res, httpStatus.ok, "", result[0]);
        }

        // Remove
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, "Viewing Report Red Line Activity");
        }

        const result = await getAllReportByType(req, pageSize, pageNo, type);
        
        return successResponse(res, httpStatus.ok, "", result[0]);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, 'Failed To Fetch Red Line Activity');
    }
}

const getDataHeaderReport = async(req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const {idReport} = req.params;
        const {type} = req.query;

        const dataPengajuanRes = await getPerTable(reportDataPengajuan, idReport, type, transaction);
        const identitasPenerimaRes = await getPerTable(reportIdentitasPenerima, idReport, type, transaction);
        const identitasPengirimRes = await getPerTable(reportIdentitasPengirim, idReport, type, transaction);
        const transaksiPerdaganganRes = await getPerTable(reportTransaksiPerdagangan, idReport, type, transaction);
        const dataPengakutanRes = await getPerTable(reportDataPengangkutan, idReport, type, transaction);
        const pelabuhanMuatBongkarRes = await getPerTable(reportDataPelabuhanMuatBongkar, idReport, type, transaction);
        const dataBeratDanVolRes = await getPerTable(reportDataBeratDanVolume, idReport, type, transaction);
        const dataPetiKemasDanPengemasRes = await getPerTable(reportDataPetiKemasDanPengemas, idReport, type, transaction);
        const dataTempatPnimbunanRes = await getPerTable(reportDataTempatPenimbunan, idReport, type, transaction);
        const datePerkiraanTanggalPengeluaranRes = await getPerTable(reportDataPerkiraanTanggalPengeluaran, idReport, type, transaction);
        const payload = {
            dataPengajuan: dataPengajuanRes.toJSON(),
            identitasPenerima: identitasPenerimaRes.toJSON(),
            IdentitasPengirim: identitasPengirimRes.toJSON(),
            transaksiPerdagangan: transaksiPerdaganganRes.toJSON(),
            dataPengangkutan: dataPengakutanRes.toJSON(),
            dataPelabuhanMuatBongkar: pelabuhanMuatBongkarRes.toJSON(),
            dataBeratDanVolumne: dataBeratDanVolRes.toJSON(),
            dataPetiKemasDanPengemas: dataPetiKemasDanPengemasRes.toJSON(),
            dataTempatPenimbunan: dataTempatPnimbunanRes.toJSON(),
            dataPerkiraanTanggalPengeluaran: datePerkiraanTanggalPengeluaranRes.toJSON()
        }

        await transaction.commit()
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, idReport, "Get Data Header Report");
        }

        return successResponse(res, httpStatus.ok, "", payload)
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, httpStatus.internalServerError, "Failed To Fetch Data Header");
    }
}

const getDataLanjutanReport = async(req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        
        const {idReport} = req.params;
        const {type} = req.query;

        const dataDokumenRes = await getPerTableBarangDokumen(reportListDokumen, idReport, type, transaction);
        let dataDokumen = [];
        
        dataDokumenRes.forEach((res, _) => {
            dataDokumen.push(res.dataValues);
        });

        const dataPetiKemasRes = await getPerTable(reportDataPetiKemas, idReport, type, transaction)
        
        const payload = {
            dataDokumen,
            dataPetiKemas: dataPetiKemasRes.toJSON(),
        }
        await transaction.commit();
        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, idReport, "Get Data Lanjutan Report");
        }

        return successResponse(res, httpStatus.ok, "", payload);
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, httpStatus.internalServerError, "Failed To Fetch Data Dokumen");
    }
}

const getDataBarangReport =  async(req, res) => {
    let transaction;
    try {
        const {idReport} = req.params;
        const {type} = req.query;

        const dataBarangRes = await getPerTableBarangDokumen(reportListBarang, idReport, type);

        let dataBarang = [];

        dataBarangRes.forEach((res, _) => {
            dataBarang.push(res.dataValues);
        })

        const payload = {
            dataBarang
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, id, `Get Data Barang Report`);
        }

        return successResponse(res, httpStatus.ok, "", payload);
        
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, "Failed To Fetch Data Barang")
    }
}

const getOneUser = async(req, res) => {
    try {
        const result = await getOneUserData(req, req.currentUser);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Get Data User`);
        }

        return successResponse(res, httpStatus.ok,"", result);
    } catch (error) {

        return errorResponse(res, httpStatus.internalServerError, "Failed To Fetch Data User")
    }
}

const getStatusNull = async(req, res) => {
    
}

module.exports = (routes) => {
    routes.get('/', authentication, getAll);
    routes.get('/total', authentication, getCountReportByType);
    routes.get('/oneReport/:id', authentication, getOne);
    routes.get('/getXML/:id', authentication, getXMLReport);
    routes.get('/getTotalReport', authentication, getTotalReport);
    routes.get('/dataJalurMerah', authentication, getDataActivityRedLine);
    routes.get('/data-header/:idReport', authentication, getDataHeaderReport);
    routes.get('/data-lanjutan/:idReport', authentication, getDataLanjutanReport);
    routes.get('/data-barang/:idReport', authentication, getDataBarangReport);
    routes.get('/user', authentication, getOneUser);
}
