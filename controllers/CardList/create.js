const { ActivityUser } = require("../../helper/Activity.interface");
const { AddContact } = require("../../helper/CardList");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionInsert } = require("../../middlewares/permission");

const addContactCardList = async (req, res) => {
  try {
    if (CheckPermissionInsert(req, res, ActivityUser.CardList) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { DataToInput } = req.body;

    const result = await AddContact(res, DataToInput);

    return successResponse(
      res,
      httpStatus.created,
      "Success Create New Contact"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create New Contact"
    );
  }
};

module.exports = {
  addContactCardList,
};
