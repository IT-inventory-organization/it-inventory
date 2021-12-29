const Report = require("./report");
const DokumenPemasukan = require("./dokumen_pemasukan");
const DokumenPengeluaran = require("./dokumen_pengeluaran");
const DokumenTambahan = require("./dokumen_tambahan");
const DataPelabuhan = require("./data_pelabuhan");
const IdentitasBarang = require("./identitas_barang");
const DataKapal = require("./data_kapal");
const PembeliBarang = require("./pembeli_barang");
const PPJK = require("./ppjk");
const dataBarang = require("./data_barang");
const beratDanVolume = require("./berat_dan_volume");
const DataPengangkutan = require("./data_pengangkutan");
const MataUang = require("./mata_uang");
const PengusahaPLB = require("./pengusaha_plb");
const PenjualBarang = require("./penjual_barang");
const TempatPenimbunan = require("./tempat_penimbunan");
const Roles = require("./role");
const InfoPengguna = require("./info_pengguna");
const PengirimBarang = require("./pengirim_barang");
const AdjustmentBarang = require("./adjustment_barang");
const ProduksiBarang = require("./produksi_barang");
const ProduksiBarangDetail = require("./produksi_barang_detail");
const PO = require("./po");
const barangPO = require("./barang_po");
const BCF3315 = require("./bcf3315");
const Approval = require("./approval");

const setAssociations = function() {

  /**
   * * New Database Relations
   * * Report Relation With Other Report
   */

  Report.hasOne(DokumenPemasukan, {foreignKey: 'reportId'});
  Report.hasOne(DokumenPengeluaran, {foreignKey: 'reportId'});
  Report.hasOne(DokumenTambahan, {foreignKey: 'reportId'});
  Report.hasOne(DataPelabuhan, {foreignKey: 'reportId'});
  Report.hasOne(DataKapal, {foreignKey: 'reportId'});
  Report.hasOne(IdentitasBarang, {foreignKey: 'reportId'});
  Report.hasOne(PembeliBarang, {foreignKey: 'reportId'});
  Report.hasOne(PPJK, {foreignKey: 'reportId'});
  Report.hasOne(beratDanVolume, {foreignKey: 'reportId'});
  Report.hasOne(DataPengangkutan, {foreignKey: 'reportId'});
  Report.hasOne(MataUang, {foreignKey: 'reportId'});
  Report.hasOne(PembeliBarang, {foreignKey: 'reportId'});
  Report.hasOne(PengusahaPLB, {foreignKey: 'reportId'});
  Report.hasOne(PengirimBarang, {foreignKey: 'reportId'});
  Report.hasOne(PenjualBarang, {foreignKey: 'reportId'});
  Report.hasOne(TempatPenimbunan, {foreignKey: 'reportId'});
  Report.hasMany(dataBarang, {foreignKey: 'reportId'});
  Report.hasMany(PO, {foreignKey: 'reportId'});

  DokumenPemasukan.hasOne(DokumenPengeluaran, {foreignKey: 'dokumenPemasukanId'});
 
  DokumenPemasukan.belongsTo(Report, {foreignKey: 'reportId'});
  DokumenPengeluaran.belongsTo(Report, {foreignKey: 'reportId'});
  DokumenPengeluaran.belongsTo(DokumenPemasukan, { foreignKey: 'id' });
  DokumenTambahan.belongsTo(Report, {foreignKey: 'reportId'});
  DataPelabuhan.belongsTo(Report, {foreignKey: 'reportId'});
  DataKapal.belongsTo(Report, {foreignKey: 'reportId'});
  IdentitasBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PembeliBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PPJK.belongsTo(Report, {foreignKey: 'reportId'});
  beratDanVolume.belongsTo(Report, {foreignKey: 'reportId'});
  DataPengangkutan.belongsTo(Report, {foreignKey: 'reportId'});
  MataUang.belongsTo(Report, {foreignKey: 'reportId'});
  PembeliBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PengusahaPLB.belongsTo(Report, {foreignKey: 'reportId'});
  PengirimBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PenjualBarang.belongsTo(Report, {foreignKey: 'reportId'});
  TempatPenimbunan.belongsTo(Report, {foreignKey: 'reportId'});
  dataBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PO.belongsTo(Report, {foreignKey: 'reportId'});

  DataKapal.hasOne(TempatPenimbunan, {foreignKey: 'id'});
  TempatPenimbunan.belongsTo(DataKapal, {foreignKey: 'idKapal'})

  // Purchase Order
  Report.hasMany(PO, {foreignKey: 'reportId'});
  PO.belongsTo(Report, {foreignKey: 'reportId'});
  
  PO.hasMany(barangPO);
  barangPO.belongsTo(PO);

  // BCF Relation With Purchase Order
  PO.hasOne(BCF3315, {foreignKey: 'poId'});
  BCF3315.belongsTo(PO, {foreignKey: 'poId'});

  // Relation Barang Purchase Order With Data Barang
  dataBarang.hasMany(barangPO, {foreignKey: 'idBarang'});
  barangPO.belongsTo(dataBarang, {foreignKey: 'idBarang'});
 
  InfoPengguna.hasMany(BCF3315, {foreignKey: 'id'});
  BCF3315.belongsTo(InfoPengguna, {foreignKey: 'userId'})

  /**
   * Realsi PO Dengan InfoPengguna
   * Perbaikan 23/12/2021
   */
  InfoPengguna.hasMany(PO, {foreignKey: 'id'});
  PO.belongsTo(InfoPengguna, {foreignKey: 'userId'});

  /**
   * * Roles Relation With User
   * * Success
   */
  Roles.hasOne(InfoPengguna, {foreignKey: 'roleId'});
  InfoPengguna.belongsTo(Roles, {foreignKey: 'roleId'});

  /**
   * * Report Relation With User
   * * Success
   */
  InfoPengguna.hasMany(Report, {foreignKey:'userId'});
  Report.belongsTo(InfoPengguna, {foreignKey: 'userId'})

  AdjustmentBarang.belongsTo(dataBarang);
  dataBarang.hasMany(AdjustmentBarang);

  ProduksiBarang.hasMany(ProduksiBarangDetail, { as: 'details' });
  ProduksiBarangDetail.belongsTo(ProduksiBarang, { foreignKey: 'produksiBarangId' });
  ProduksiBarangDetail.belongsTo(dataBarang, { foreignKey: 'dataBarangId' });

  BCF3315.hasMany(Approval, { foreignKey: 'bcfId' });
  Approval.belongsTo(BCF3315, { foreignKey: 'bcfId' });
};

module.exports = setAssociations;
