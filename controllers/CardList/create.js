const { AddContact } = require("../../helper/CardList");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const addContactCardList = async (req, res) => {
  try {
    const { DataToInput } = req.body;

    const result = await AddContact(res, DataToInput);

    return successResponse(
      res,
      httpStatus.created,
      "Success Create New Contact"
    );
  } catch (error) {
    console.log(error);
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
