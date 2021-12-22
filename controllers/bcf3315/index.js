const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const Form3315 = require('../../database/models/bcf3315');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');
// const { successResponse } = require('../../helper/Response');
const dataBarang = require('../../database/models/data_barang');
const httpStatus = require('../../helper/Httplib');

const list = async(req, res) => {
    try {
		const form3315 = await Form3315.findAndCountAll({});
		// console.log(form3315);
		return successResponse(res, Http.ok, "Success", form3315, true);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "terjadi kesalahan server");
    }
}

const onCreateValidation = [
	body('nomorPO')
		.notEmpty().withMessage('kolom nomor PO kosong, perlu di isi')
		// .custom(value => {
		// 	return Form3315.findOne({ where: {nomorPo: value} })
		// 	.then((d) => {
		// 		if(d) return Promise.reject('kolom nomor po duplikat, perlu perbaikan');
		// 	});
		// })
		.trim(),
	body('tanggal')
		.notEmpty().withMessage('kolom tanggal kosong, perlu di isi')
		.isDate().withMessage('kolom format tanggal salah, perlu di perbaiki')
		,
	body('penanggungJawab')
		.notEmpty().withMessage('kolom penanggung jawab kosong, perlu di isi')
		.trim()
		,
	body('jabatan')
		.notEmpty().withMessage('kolom jabatan kosong, perlu di isi')
		.trim()
		,
	body('nomorFormBcf3315')
		.notEmpty().withMessage('kolom nomor kosong, perlu di isi')
		.isNumeric().withMessage('isi hanya dengan angka tanpa huruf')
		.trim()
		,
	body('lampiran')
		.notEmpty().withMessage('kolom lampiran kosong, perlu di isi')
		.trim()
		,
	body('npwp')
		.notEmpty().withMessage('kolom npwp kosong, perlu di isi')
		.trim()
		,
	body('alamat')
		.notEmpty().withMessage('kolom alamat kosong, perlu di isi')
		.trim()
		,
	body('nama')
		.notEmpty().withMessage('kolom nama exportir / pengusaha plb / pplb kosong, perlu di isi')
		.trim()
		,
	body('lokasiPLB')
		.notEmpty().withMessage('kolom lokasi plb penimbunan kosong, perlu di isi')
		.trim()
		,
	body('caraPengangkutan')
		.notEmpty().withMessage('kolom cara pengangkkutan kosong, perlu di isi')
		.trim()
		,
	body('pelabuhanMuat')
		.notEmpty().withMessage('kolom pelabuhan muat kosong, perlu di isi')
		.trim()
		,
	body('tanggalPerkiraan')
		.notEmpty().withMessage('kolom tanggal perkiraan kosong, perlu di isi')
		.isDate().withMessage('kolom format tanggal salah, perlu di perbaiki')
		,
	body('namaPengangkutKeLuar')
		.notEmpty().withMessage('kolom nama pengangkut ke luar kosong, perlu di isi')
		.trim()
		,
	body('voyage')
		.notEmpty().withMessage('kolom voyage kosong, perlu di isi')
		.trim()
		,
	body('callSign')
		.notEmpty().withMessage('kolom call sign kosong, perlu di isi')
		.trim()
		,
	body('poId')
		.notEmpty().withMessage('poId kosong, terjadi kesalahan server')
		.isNumeric().withMessage('isi hanya dengan angka tanpa huruf')
		.trim()
		,
	body('status')
		.notEmpty().withMessage('kolom status kosong, perlu terisi')
		.trim()
		,
	body('nomorbcf3314')
		.trim()
	];

const create = async(req, res) => {
	let transaction;
	try {

		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return errorResponse(res, Http.internalServerError, "validation error", errors.array());
		}

		const body = matchedData(req);


        transaction = await sequelize.transaction();

		// console.log(body) utk melihat data body

		const form3315 = await Form3315.create(body, {transaction});
		

		if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", form3315, true);
    } catch (error) {
        console.error(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const get = async (req, res) => {
    try{
        let id = req.params.id;
		// let body = req.body
        let data = await Form3315.findOne({
            where: {
                id: id
            }
        })
		return successResponse(res, Http.ok, "Success", data, true);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "terjadi kesalahan server");
    }
}

const update = async (req, res) => {
	try{
		let id = req.params.id;
		let body = req.body;

		const updateDataPerId = await Form3315.findOne({
			where: {
				id: id,
			}
		})
		const result = updateDataPerId.toJSON();
		if(result.status = "menunggu"){
			await Form3315.update(body,{
				where: {
					id: id
				}
			});
			return successResponse(res, httpStatus.ok, result, "Berhasil Di Update", '', true);
		}

		return errorResponse(res, httpStatus.badRequest, "BCF 3.3.15 Sudah Di Update", "");
	}catch(error){
		return errorResponse(res, httpStatus.internalServerError, "Gagal Terjadi Kesalahan Pada Server", "")
	}
}

const hapus = async (req, res) => {
	try{
		let id = req.params.id;
		
		const statusDataPerId = await Form3315.findOne({
			where: {
				id: id,
			}
		})
		const result = statusDataPerId.toJSON();
		if(result.status != "diterima"){
			await Form3315.destroy({
				where: {
					id: id, 
				}
			});
			return successResponse(res, httpStatus.ok, "Berhasil Di Hapus", '', true);
		}

		return errorResponse(res, httpStatus.badRequest, "BCF 3.3.15 Sudah Di hapus", "");
	}catch(error){
		return errorResponse(res, httpStatus.internalServerError, "Gagal Terjadi Kesalahan Pada Server", "")
	}
}

module.exports = routes => {
	routes.get('/list', authentication, list),
	routes.get('/:id', authentication, get)
	routes.post('/create', authentication, onCreateValidation, create),
	// routes.get('/:status', authentication, status),
	routes.put('/update/:id', authentication, update)
	routes.delete('/delete/:id', authentication, hapus)
}