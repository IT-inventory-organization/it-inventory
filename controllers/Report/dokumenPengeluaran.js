// const { saveBeratDanVolume } = require("../../helper/Repository/beratDanVolume");
// const { saveDataKapal } = require("../../helper/Repository/dataKapal");
// const { saveDataPengajuan } = require("../../helper/Repository/dataPengajuan");
// const { saveDataPengangkutan } = require("../../helper/Repository/dataPengangkutan");
// const { saveMataUang } = require("../../helper/Repository/mataUang");
// const { savePembeliBarang } = require("../../helper/Repository/pembeliBarang");
// const { savePengusahaPLB } = require("../../helper/Repository/pengusahaPLB");
// const { savePenjualBarang } = require("../../helper/Repository/penjualBarang");

// const saveDokumePengeluaran = async(req, res) => {
//     let transaction;
// }

// try {
//     const {ref} = req.body;
    
//     transaction = await sequelize.transaction();

//     const resultDataPengeluran = await saveDataPengajuan(ref.dokumenPengeluaran, transaction);
//     const resultDataTambahan = await saveDataTambahan(ref.dokumenTambahan, transaction);
//     const resultDataPelabuhan = await saveDataPelabuhan (ref.dataPelabuhan, transaction);
//     const resultDataKapal = await saveDataKapal(ref.dataKapal, transaction);
//     const resultIdentitasBarang = await saveIdentitasBarang(ref.identitasBarang, transaction);
//     const resultPenjualBarang = await savePenjualBarang(ref.penjualBarang, transaction)
//     const resultPengirimBarang = awaitsavePengirimBarang(ref.pengirimBarang, transaction);
//     const resultPembeliBarang = await savePembeliBarang(ref.pembeliBarang, transaction);
//     const resultPengusahaPLB = await savePengusahaPLB(ref.pengusahaPLB, transaction);
//     const resultPpjk = await saveDataPpjjk(ref.ppjk, transaction);
//     const resultMataUang = await saveMataUang(ref.mataUang, transaction);
//     const resultDataPengangkutan = await saveDataPengangkutan(red.dataPengangkutan, transaction);
//     const resultBeratdanVolume = await saveBeratDanVolume(ref.beratDanVolume, transaction);
//     const reusltBeratDanVolume = await saveBeratDanVolume(ref.beratDanVolume, transaction);

//     const data = {
//         dataPengajuan: resultDataPengeluaran.id,
//         dataTambahan: resultDataTambahan.id,
//         dataPelabuhan: resultDataPelabuhan.id,
//         dataKapal: resultDataKapal.id,
//             identitasBarang: resultIdentitasBarang.id,
//             penjualBarang: resultPenjualBarang.id,
//             pengirimBarang: resultPengirimBarang.id,
//             pengusahaPLB: resultPengusahaPLB.id,
//             pembeliBarang: resultPembeliBarang.id,
//             ppjk: resultPpjk.id,
//             mataUang: resultMataUang.id,
//             dataPengangkutan: resultDataPengangkutan.id,
//             beratDanVolume: reusltBeratDanVolume.id,
//             // tempatPenimbunan: resultTempatPenimbunan.id
//     }

//     if(req.currentRole !== 'Owner'){
//         saveAktifitas({userId: req.currentUser, reportId: ref.dokumenPengeluaran.reportId, aktifitas: "Membuat Dokumen Pngeluaran"});
//     }
//     await transaction.commit();
//     return successResponse(res, Http.created, "Berhasil Menyimpan Data Dokumen", data);
// } catch (error) {

//     if(transaction){
//         await transaction.rollback();
//     }
//     return errorResponse(res, error.status, error.message);

// }