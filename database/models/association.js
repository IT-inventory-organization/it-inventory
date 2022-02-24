const reportDataBeratDanVolume = require("./databeratdanvolume");
const reportDataPelabuhanMuatBongkar = require("./datapelabuhanmuatbongkar");
const reportDataPengajuan = require("./datapengajuan");
const reportDataPengangkutan = require("./datapengangkutan");
const reportDataPerkiraanTanggalPengeluaran = require("./dataperkiraantanggalpengeluaran");
const reportDataPetiKemas = require("./datapetikemas");
const reportDataPetiKemasDanPengemas = require("./datapetikemasdanpengemas");
const reportDataTempatPenimbunan = require("./datatempatpenimbunan");
const reportIdentitasPenerima = require("./identitaspenerima");
const reportIdentitasPengirim = require("./identitaspengirim");
const reportListBarang = require("./listbarang");
const reportListDokumen = require("./listdokumen");
const Report = require("./report");
const Role = require("./role");
const reportTransaksiPerdagangan = require("./transaksiperdagangan");
const User = require("./user");
const UserActivity = require("./useractivity");
const reportDataLartas = require("./datalartas");
const Barang = require("./barang");
const Histories = require("./history");
const reportIdentitasPPJK = require("./identitasppjk");
const PurchaseOrder = require("./purchaseOrder");
const BarangPurchaseOrder = require("./barangPurchaseOrder");
const ReceiveItems = require("./receivedItems");
const ReceivedItemsQty = require("./receivedItemsQty");
const CardList = require("./cardList");
const Bill = require("./bill");
const BillPriceItem = require("./billPriceItem");
const SalesOrder = require("./salesOrder");
const SalesOrderBarang = require("./salesOrderBarang");
const DeliveryOrder = require("./deliveryOrder");
const DeliveryOrderBarang = require("./deliveryOrderBarang");
const Invoice = require("./invoice");
const InvoiceDetail = require("./invoiceDetail");
const BillPayment = require("./billPayment");
const BillPaymentItems = require("./billPaymentItems");
const ReceivePayment = require("./receivePayment");
const ReceivePaymentDetail = require("./receivePaymentDetail");
const UserPrivilages = require("./userPrivilages");

const setAssociations = function () {
  Report.hasOne(reportIdentitasPenerima, { foreignKey: "reportId" });
  Report.hasOne(reportIdentitasPengirim, { foreignKey: "reportId" });
  Report.hasOne(reportDataBeratDanVolume, { foreignKey: "reportId" });
  Report.hasOne(reportDataPelabuhanMuatBongkar, { foreignKey: "reportId" });
  Report.hasOne(reportDataPengajuan, { foreignKey: "reportId" });
  Report.hasOne(reportDataPengangkutan, { foreignKey: "reportId" });
  Report.hasOne(reportDataPerkiraanTanggalPengeluaran, {
    foreignKey: "reportId",
  });
  Report.hasOne(reportDataPetiKemas, { foreignKey: "reportId" });
  Report.hasOne(reportDataPetiKemasDanPengemas, { foreignKey: "reportId" });
  Report.hasOne(reportDataTempatPenimbunan, { foreignKey: "reportId" });
  Report.hasOne(reportTransaksiPerdagangan, { foreignKey: "reportId" });
  Report.hasMany(reportListBarang, { foreignKey: "reportId" });
  Report.hasMany(reportListDokumen, { foreignKey: "reportId" });
  Report.belongsTo(User, { foreignKey: "userId" });
  Report.hasOne(reportDataLartas, { foreignKey: "reportId" });
  Report.hasOne(reportIdentitasPPJK, { foreignKey: "reportId" });

  reportIdentitasPenerima.belongsTo(Report, { foreignKey: "reportId" });
  reportIdentitasPengirim.belongsTo(Report, { foreignKey: "reportId" });
  reportDataBeratDanVolume.belongsTo(Report, { foreignKey: "reportId" });
  reportDataPelabuhanMuatBongkar.belongsTo(Report, { foreignKey: "reportId" });
  reportDataPengajuan.belongsTo(Report, { foreignKey: "reportId" });
  reportDataPengangkutan.belongsTo(Report, { foreignKey: "reportId" });
  reportDataPerkiraanTanggalPengeluaran.belongsTo(Report, {
    foreignKey: "reportId",
  });
  reportDataPetiKemas.belongsTo(Report, { foreignKey: "reportId" });
  reportDataPetiKemasDanPengemas.belongsTo(Report, { foreignKey: "reportId" });
  reportDataTempatPenimbunan.belongsTo(Report, { foreignKey: "reportId" });
  reportTransaksiPerdagangan.belongsTo(Report, { foreignKey: "reportId" });
  reportListBarang.belongsTo(Report, { foreignKey: "reportId" });
  reportListDokumen.belongsTo(Report, { foreignKey: "reportId" });
  reportDataLartas.belongsTo(Report, { foreignKey: "reportId" });
  /**
   * New
   */
  reportIdentitasPPJK.belongsTo(Report, { foreignKey: "reportId" });

  Role.hasOne(User, { foreignKey: "role_id" });
  User.belongsTo(Role, { foreignKey: "role_id" });

  User.hasMany(UserActivity, { foreignKey: "userId" });
  Report.hasMany(UserActivity, { foreignKey: "reportId" });
  UserActivity.belongsTo(User, { foreignKey: "userId" });
  UserActivity.belongsTo(Report, { foreignKey: "reportId" });
  User.hasMany(Report, { foreignKey: "userId" });

  // Barang
  User.hasMany(Barang, { foreignKey: "id" });
  Barang.belongsTo(User, { foreignKey: "userId" });

  // Mandatory
  Report.belongsToMany(Barang, {
    through: reportListBarang,
    foreignKey: "reportId",
  });
  Barang.belongsToMany(Report, {
    through: reportListBarang,
    foreignKey: "idBarang",
  });

  Barang.hasMany(reportListBarang, { foreignKey: "idBarang" });
  reportListBarang.belongsTo(Barang, { foreignKey: "idBarang" });
  reportListBarang.belongsTo(Report, { foreignKey: "reportId" });

  // Mandatory
  Report.belongsToMany(Barang, { through: Histories, foreignKey: "reportId" });
  Barang.belongsToMany(Report, { through: Histories, foreignKey: "idBarang" });

  // Barang.belongsToMany(Histories, {foreignKey: 'idBarang'});
  // Report.belongsToMany(Histories, {foreignKey: 'reportId'});
  Histories.belongsTo(Barang, { foreignKey: "idBarang" });
  Histories.belongsTo(Report, { foreignKey: "reportId" });

  PurchaseOrder.hasMany(BarangPurchaseOrder, { foreignKey: "idPo" });
  BarangPurchaseOrder.belongsTo(PurchaseOrder, { foreignKey: "id" });

  User.hasMany(PurchaseOrder, { foreignKey: "userId" });
  PurchaseOrder.belongsTo(User, { foreignKey: "id" });

  // Success
  Barang.hasMany(BarangPurchaseOrder, { foreignKey: "id" });
  BarangPurchaseOrder.belongsTo(Barang, { foreignKey: "idBarang" });

  PurchaseOrder.hasOne(ReceiveItems, { foreignKey: "idPo" });
  ReceiveItems.belongsTo(PurchaseOrder, { foreignKey: "idPo" });

  CardList.hasOne(PurchaseOrder, { foreignKey: "idContactCard" });
  PurchaseOrder.belongsTo(CardList, { foreignKey: "idContactCard" });

  ReceiveItems.hasMany(ReceivedItemsQty, { foreignKey: "idReceive" });
  ReceivedItemsQty.belongsTo(ReceiveItems, { foreignKey: "id" });

  BarangPurchaseOrder.hasOne(ReceivedItemsQty, { foreignKey: "id" });
  ReceivedItemsQty.belongsTo(BarangPurchaseOrder, { foreignKey: "idBarangPo" });

  ReceivedItemsQty.hasOne(BillPriceItem, { foreignKey: "id" });
  BillPriceItem.belongsTo(ReceivedItemsQty, { foreignKey: "idReceiveQtyItem" });

  ReceiveItems.hasOne(Bill, { foreignKey: "idReceive" });
  Bill.belongsTo(ReceiveItems, { foreignKey: "idReceive" });

  Bill.hasMany(BillPriceItem, { foreignKey: "idBill" });
  BillPriceItem.belongsTo(Bill, { foreignKey: "id" });

  SalesOrder.hasMany(SalesOrderBarang, { foreignKey: "idSo" });
  SalesOrderBarang.belongsTo(SalesOrder, { foreignKey: "id" });

  CardList.hasOne(SalesOrder, { foreignKey: "idContact" });
  SalesOrder.belongsTo(CardList, { foreignKey: "idContact" });

  Barang.hasMany(SalesOrderBarang, { foreignKey: "id" });
  SalesOrderBarang.belongsTo(Barang, { foreignKey: "idBarang" });

  SalesOrder.hasOne(DeliveryOrder, { foreignKey: "idSo" });
  DeliveryOrder.belongsTo(SalesOrder, { foreignKey: "idSo" });

  DeliveryOrder.hasMany(DeliveryOrderBarang, { foreignKey: "idDo" });
  DeliveryOrderBarang.belongsTo(DeliveryOrder, { foreignKey: "id" });

  SalesOrderBarang.hasOne(DeliveryOrderBarang, { foreignKey: "id" });
  DeliveryOrderBarang.belongsTo(SalesOrderBarang, { foreignKey: "idSOBarang" });

  DeliveryOrder.hasOne(Invoice, { foreignKey: "idDo" });
  Invoice.belongsTo(DeliveryOrder, { foreignKey: "idDo" });

  Invoice.hasMany(InvoiceDetail, { foreignKey: "idInv" });
  InvoiceDetail.belongsTo(Invoice, { foreignKey: "id" });

  // 24-02-2022
  User.hasMany(Invoice, { foreignKey: "userId" });
  Invoice.belongsTo(User, { foreignKey: "userId" });

  DeliveryOrderBarang.hasOne(InvoiceDetail, { foreignKey: "id" });
  InvoiceDetail.belongsTo(DeliveryOrderBarang, { foreignKey: "idDOBarang" });

  CardList.hasOne(Invoice, { foreignKey: "idContact" });
  Invoice.belongsTo(CardList, { foreignKey: "idContact" });

  Bill.hasOne(BillPayment, { foreignKey: "idBill" });
  BillPayment.belongsTo(Bill, { foreignKey: "idBill" });

  CardList.hasOne(BillPayment, { foreignKey: "id" });
  BillPayment.belongsTo(CardList, { foreignKey: "idContact" });

  BillPayment.hasMany(BillPaymentItems, { foreignKey: "idBillPayment" });
  BillPaymentItems.belongsTo(BillPayment, { foreignKey: "id" });

  BillPriceItem.hasOne(BillPaymentItems, { foreignKey: "id" });
  BillPaymentItems.belongsTo(BillPriceItem, { foreignKey: "idBillItem" });

  Invoice.hasOne(ReceivePayment, { foreignKey: "idInv" });
  ReceivePayment.belongsTo(Invoice, { foreignKey: "idInv" });

  ReceivePayment.hasOne(ReceivePaymentDetail, {
    foreignKey: "idReceivePayment",
  });
  ReceivePaymentDetail.belongsTo(ReceivePayment, {
    foreignKey: "idReceivePayment",
  });

  CardList.hasMany(ReceivePayment, { foreignKey: "idContact" });
  ReceivePayment.belongsTo(CardList, { foreignKey: "idContact" });

  User.hasMany(UserPrivilages, { foreignKey: "userId" });
  UserPrivilages.belongsTo(User, { foreignKey: "id" });
};

module.exports = setAssociations;
