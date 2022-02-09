const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteBill } = require("../../helper/Bill");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");

const deleteBill = async (req, res) => {
  try {
    const { idBill } = req.params;

    await DeleteBill(idBill);
    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Bill",
        sourceId: idBill,
        sourceType: ActivityUser.Bill,
        userId: req.currentUser,
      });
    }
    return successResponse(res, httpStatus.ok, "Success Delete Bill");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Bill"
    );
  }
};

module.exports = {
  deleteBill,
};
