const CardList = require("../../database/models/cardList");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const { CardUserType } = require("../cardUserType.enum");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const ViewAll = async (req, res, transaction = null) => {
  try {
    return CardList.findAll({
      where: {
        isDelete: false,
      },
      attributes: ["contactType", "name", "ID", "email", "phone"],
      transaction: transaction,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List"
    );
  }
};

const ViewOne = async (req, res, IDContact, transaction = null) => {
  try {
    return CardList.findOne({
      where: {
        ID: IDContact,
        isDelete: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "isDelete"],
      },
      transaction: transaction,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One List"
    );
  }
};

const ViewAllSupplier = async (res, transaction = null) => {
  try {
    return CardList.findAll({
      where: {
        contactType: CardUserType.SUPPLIER,
        isDelete: false,
      },
      include: [
        {
          model: PurchaseOrder,
          where: {
            isDelete: false,
          },
          attributes: ["nomorPO", "idContactCard", "id"],
          required: false,
        },
      ],
      transaction: transaction,
      attributes: ["name", "ID"],
    });
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed to fetch list of Supplier"
    );
  }
};

module.exports = { ViewAll, ViewOne, ViewAllSupplier };
