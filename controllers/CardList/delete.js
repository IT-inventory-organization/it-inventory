const { DeleteContact } = require("../../helper/CardList");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const deleteCardList = async (req, res) => {
  try {
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
