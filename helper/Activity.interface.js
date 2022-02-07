class ActivityUser {
  static PPFTZ_IN = "PPFTZ_In";
  static PPFTZ_OUT = "PPFTZ_Out";
  static Adjustment = "Adjustment";
  static ReceiveItem = "ReceiveItem";
  static DeliveryOrder = "DeliveryOrder";
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
};
