const { StatsItem } = require("../../helper/Activity.interface");
const { findBarang } = require("../../helper/Barang");
const { calculateBalance } = require("../../helper/calculateStock");
const { historyBarang } = require("../../helper/Histories/barang");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

module.exports = {
  getHistoryBarang: async (req, res) => {
    try {
      const { idBarang } = req.params;
      const find = await findBarang(idBarang, null, true);
      const result = await historyBarang(idBarang, null);
      if (!find) {
        return errorResponse(
          res,
          httpStatus.notFound,
          "It Seems the Items is Didn`t Exist Or Already Been Delete"
        );
      }
      let temp = {
        ...find.toJSON(),
      };

      temp = {
        ...temp,
        history: calculateBalance(result[0], temp.stock),
      };

      return successResponse(res, httpStatus.ok, "", temp);
    } catch (error) {
      console.log(error);
      return errorResponse(
        res,
        httpStatus.internalServerError,
        "Failed To Fetch History"
      );
    }
  },
};
