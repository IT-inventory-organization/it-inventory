const CardList = require("../../database/models/cardList");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const AddContact = async (res, data, transaction = null) => {
  try {
    data._ID = data.ID;
    return CardList.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create New Contact"
    );
  }
};

const UpdateContact = async (req, res, idContact, data, transaction = null) => {
  try {
    data._ID = data.ID;

    return CardList.update(data, {
      where: {
        id: idContact,
        isDelete: false,
      },
      returning: true,
      transaction: transaction,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update List"
    );
  }
};

const DeleteContact = async (res, idContact, transaction = null) => {
  try {
    return CardList.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: idContact,
        },
        transaction: transaction,
        returning: true,
      }
    );
  } catch (error) {
    //
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete List"
    );
  }
};
module.exports = {
  AddContact,
  UpdateContact,
  DeleteContact,
};
