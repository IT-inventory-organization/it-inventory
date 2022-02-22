const { ActivityUser } = require("../../helper/Activity.interface");
const { UpdateContact } = require("../../helper/CardList");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

const updateCardList = async (req, res) => {
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.CardList) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idContact } = req.params;
    const { DataToInput } = req.body;
    const result = await UpdateContact(req, res, idContact, DataToInput);

    return successResponse(res, httpStatus.accepted, "Success Update List");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed Update Card List "
    );
  }
};

module.exports = {
  updateCardList,
};
