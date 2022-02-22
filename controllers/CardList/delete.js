const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteContact } = require("../../helper/CardList");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteCardList = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.CardList) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idContact } = req.params;

    const result = await DeleteContact(res, idContact);

    return successResponse(res, httpStatus.accepted, "Success Delete List");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete List"
    );
  }
};

module.exports = {
  deleteCardList,
};
