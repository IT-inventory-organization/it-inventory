const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, succesResponse } = require('../../helper/bcrypt');
const Http = require('../../helper/Httplib');
const Form3315 = require('../../database/models/bcf3315');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');
const { successResponse } = require('../../helper/Response');

const list = async(req, res) => {
    try {
		const data = await Form3315.findAll({
			attributes: ["nama", "nomorPO", "tanggal", "nomorFormBcf3315"]
		});
		return res.json({
			status: "ok",
			data: data
		})
    }catch(error){
		res.status(500).json({
			status:'error',
			data: error
		})
	}
}


const onCreateValidation = [
	body('nomorPO')
		.notEmpty().withMessage('kolom nomor PO kosong, perlu di isi')
		.custom(value => {
			return Form3315.findOne({ where: {nomorPo: value} })
			.then((d) => {
				if(d) return Promise.reject('kolom nomor po duplikat, perlu perbaikan');
			});
		})
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
	body('lokasi PLB')
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

		const data = await Form3315.create(body, { transaction });
		
		if(transaction) await transaction.commit();
		return successResponse(res, Http.ok, "Succes", data, false);
	}catch(error){
		console.error(error);
		if(transaction) await transaction.rollback();
		return errorResponse(res, Http.internalServerError, 'terjadi kesalahan')
	}
}

module.exports = routes => {
	routes.get('/', authentication, list),
	routes.post('/create', authentication, onCreateValidation, create)
}