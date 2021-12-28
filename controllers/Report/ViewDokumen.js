const httpStatus = require("../../helper/Httplib")
const { getOneDocumentPemasukan, getOneDocumentPemasukanXML } = require("../../helper/Repository/dokumenPemasukan")
const { getOneDocumentPengeluaran, getOneDocumentPengeluaranXML } = require("../../helper/Repository/dokumenPengeluaran")
const { successResponse, errorResponse } = require("../../helper/Response")
const { XMLPemasukan, XMLPengeluaran } = require("../../helper/xmlFormat")
const authentication = require("../../middlewares/authentication")
const { NotFoundException, ServerFault } = require("../../middlewares/errHandler")

const getViewDocument = async(req, res) => {
    try {
        const url = req.route.path.split('/');
        const {id} = req.params;
        
        if(url[2] == 'pemasukan'){
            const result = await getOneDocumentPemasukan(req, id);
            console.log(result.toJSON());
            if(!result || result.length == 0){
                throw new NotFoundException("Data Tidak Ada", '', req);
            }
            return successResponse(res, httpStatus.ok, "", result, true)
        }else if(url[2] == 'pengeluaran'){
            const result = await getOneDocumentPengeluaran(req, id);
            if(!result || result.length == 0){
                throw new NotFoundException('Data Tidak Ada', '', req);
            }
            return successResponse(res, httpStatus.ok, "", result, true)
        }else{
            throw new ServerFault("Tejadi Kesalahan Pada Server", '', req)
        }
    } catch (error) {
        console.log(error)
        if(!error.status){
            return errorResponse(res, httpStatus.internalServerError, "Terjadi Kesalahan Pada Server")
        }
        return errorResponse(res, error.status, error.message)
    }
}
const getOneViewXML = async(req, res) => {
    try {
        const url = req.route.path.split('/')
        const {id} = req.params;
        
        if(url[2] == 'pemasukanXML'){
            const result = await getOneDocumentPemasukanXML(req, id);
            if(!result){
                throw new NotFoundException("Data Tidak Ada");
            }
            const xmlResult = XMLPemasukan(result);
            
            return successResponse(res, httpStatus.ok, "", xmlResult, true)
        }else if(url[2] == 'pengeluaranXML'){
            const result = await getOneDocumentPengeluaranXML(req, id);
            if(!result){
                throw new NotFoundException('Data Tidak Ada');
            }
            const XMLResult = XMLPengeluaran(result);
            return successResponse(res, httpStatus.ok, "", XMLResult, true)
        }else{
            throw new ServerFault("Tejadi Kesalahan Pada Server")
        }
    } catch (error) {
        if(!error.status){
            return errorResponse(res, httpStatus.internalServerError, "Terjadi Kesalahan Pada Server")
        }
        return errorResponse(res, error.status, error.message)
    }
}

module.exports = routes => {
    routes.get('/get/pemasukan/:id', authentication, getViewDocument);
    routes.get('/get/pengeluaran/:id', authentication, getViewDocument);
    routes.get('/get/pemasukanXML/:id', authentication, getOneViewXML);
    routes.get('/get/pengeluaranXML/:id', authentication, getOneViewXML);
}