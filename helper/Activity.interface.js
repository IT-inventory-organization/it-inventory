/**
 * * Nilai Static yang dipakai untuk
 * * mengecek,
 */
class ActivityUser {
  static PPFTZ = "PPFTZ";
  static PPFTZ_IN = "PPFTZ_In";
  static PPFTZ_OUT = "PPFTZ_Out";
  static Adjustment = "Adjustment";
  static ReceiveItem = "ReceiveItem";
  static DeliveryOrder = "DeliveryOrder";
  static PurchaseOrder = "PurchaseOrder";
  static SalesOrder = "SalesOrder";
  static Bill = "Bill";
  static BillPayment = "BillPayment";
  static Invoice = "Invoice";
  static ReceivePayment = "ReceivePayment";
  static CashReceive = "CashReceive";
  static CashDisbursement = "CashDisbursement";
  static SaldoAwal = "SaldoAwal";
  static CardList = "CardList";
  static PPFTZ = "PPFTZ";
  static Barang = "Barang";
  static ReportAccounting = "ReportAccounting";
  static Register = "Register";
  static Permission = "Permission";
  static User = "User";

  static LAccessModule = [
    this.PPFTZ,
    this.Adjustment,
    this.ReceiveItem,
    this.DeliveryOrder,
    this.PurchaseOrder,
    this.SalesOrder,
    this.Bill,
    this.BillPayment,
    this.Invoice,
    this.ReceivePayment,
    this.CashReceive,
    this.CashDisbursement,
    this.SaldoAwal,
    this.CardList,
    this.Barang,
    this.ReportAccounting,
    this.Register,
    this.Permission,
  ];
}

class Privilages {
  static Read = "Read";
  static Ïnsert = "Ïnsert";
  static Delete = "Delete";
  static Update = "Update";
  static Print = "Print";
}

class Description {
  static ADD = "Penambahan Barang";
  static MINUS = "Pengurangan Barang";
}

class StatsItem {
  static INC = "increase";
  static DEC = "decrease";
}

class InfoReport {
  static IN = "Pemasukan";
  static OUT = "Pengeluaran";
}

class StatsInvoice {
  static DRAFT = "DRAFT";
  static DONE = "DONE";
}

module.exports = {
  ActivityUser,
  Description,
  StatsItem,
  InfoReport,
  StatsInvoice,
  Privilages,
};
