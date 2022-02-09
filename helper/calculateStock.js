const { StatsItem } = require("./Activity.interface");
const { DateConv } = require("./convert");
class Returning {
  static BALANCE_ITEM_HISTORY = "balance_item_history";
  static CURRENT_STOCK = "current_stock";
}
module.exports = {
  /**
   *
   * @param {Object[]} Histories - The Histories For An Item
   * @param {number} Histories.quantity - Quantitiy Number of Item
   * @param {string} Histories.sourceType - A Type Of Source Of Where The item is inc or dec
   * @param {string} Histories.status - Stats Of Inc Or Dec
   * @param {number} Histories.balance - Current f Value
   * @param {number} stock - Main Value Of Items Quantity
   */
  calculateBalance: (
    Histories,
    stock,
    returning = Returning.BALANCE_ITEM_HISTORY
  ) => {
    let tempVal = stock;
    const History = [];

    for (const iterator of Histories) {
      let val = null;
      if (iterator.status == StatsItem.INC) {
        val = tempVal + iterator.quantity;
        tempVal = val;
      }
      if (iterator.status == StatsItem.DEC) {
        val = tempVal - iterator.quantity;
        tempVal = val;
      }
      iterator.balance = val;
      iterator.tanggal = DateConv(iterator.tanggal);
      History.push(iterator);
    }
    // console.log(History);
    if (returning == Returning.BALANCE_ITEM_HISTORY) {
      return History;
    } else if (returning == Returning.CURRENT_STOCK) {
      return tempVal;
    }
  },
  Returning: Returning,
};
