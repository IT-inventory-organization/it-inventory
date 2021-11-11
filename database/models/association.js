const Report = require("./report");
const DokumenPemasukan = require("./dokumen_pemasukan");
const DokumenTambahan = require("./dokumen_tambahan");
const DataPelabuhan = require("./data_pelabuhan");
const IdentitasBarang = require("./identitas_barang");
const DataKapal = require("./data_kapal");
const PembeliBarang = require("./pembeli_barang");
const PPJK = require("./ppjk");
const data_barang = require("./data_barang");
const berat_dan_volume = require("./berat_dan_volume");
const DataPengangkutan = require("./data_pengangkutan");
const MataUang = require("./mata_uang");
const PengusahaPLB = require("./pengusaha_plb");
const PenjualBarang = require("./penjual_barang");
const TempatPenimbunan = require("./tempat_penimbunan");
const Roles = require("./role");
const InfoPengguna = require("./info_pengguna");

const setAssociations = function() {

  /**
   * * New Database Relations
   * * Report Relation With Other Report
   */

  Report.hasOne(DokumenPemasukan, {foreignKey: 'reportId'});
  Report.hasOne(DokumenTambahan, {foreignKey: 'reportId'});
  Report.hasOne(DataPelabuhan, {foreignKey: 'reportId'});
  Report.hasOne(DataKapal, {foreignKey: 'reportId'});
  Report.hasOne(IdentitasBarang, {foreignKey: 'reportId'});
  Report.hasOne(PembeliBarang, {foreignKey: 'reportId'});
  Report.hasOne(PPJK, {foreignKey: 'reportId'});
  Report.hasOne(berat_dan_volume, {foreignKey: 'reportId'});
  Report.hasOne(DataPengangkutan, {foreignKey: 'reportId'});
  Report.hasOne(MataUang, {foreignKey: 'reportId'});
  Report.hasOne(PembeliBarang, {foreignKey: 'reportId'});
  Report.hasOne(PengusahaPLB, {foreignKey: 'reportId'});
  Report.hasOne(PenjualBarang, {foreignKey: 'reportId'});
  Report.hasOne(TempatPenimbunan, {foreignKey: 'reportId'});
  Report.hasMany(data_barang, {foreignKey: 'reportId'});


  DokumenPemasukan.belongsTo(Report, {foreignKey: 'reportId'});
  DokumenTambahan.belongsTo(Report, {foreignKey: 'reportId'});
  DataPelabuhan.belongsTo(Report, {foreignKey: 'reportId'});
  DataKapal.belongsTo(Report, {foreignKey: 'reportId'});
  IdentitasBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PembeliBarang.belongsTo(Report, {foreignKey: 'reportId'});
  PPJK.belongsTo(Report, {foreignKey: 'reportId'});
  data_barang.belongsTo(Report, {foreignKey: 'reportId'});
  berat_dan_volume.belongsTo(Report, {foreignKey: 'reportId'});

  /**
   * * Roles Relation With User
   */
  Roles.hasOne(InfoPengguna, {foreignKey: 'roleId'});
  InfoPengguna.belongsTo(Roles, {foreignKey: 'roleId'});

  /**
   * * Report Relation With User
   */
  InfoPengguna.hasMany(Report, {foreignKey:'userId'});
  Report.belongsTo(InfoPengguna, {foreignKey: 'userId'})
  // Report.hasMany(InfoPengguna, {foreignKey: 'userId'});
  // InfoPengguna.belongsTo(Report, {foreignKey: 'userId'})
};

module.exports = setAssociations;