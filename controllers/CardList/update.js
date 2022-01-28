const { UpdateContact } = require("../../helper/CardList");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const updateCardList = async (req, res) => {
  try {
    const { idContact } = req.params;
    const { DataToInput } = req.body;
    const result = await UpdateContact(req, res, idContact, DataToInput);

    return successResponse(res, httpStatus.accepted, "Success Update List");
  } catch (error) {
    console.log(error);
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
