const {
  ViewAll,
  ViewOne,
  ViewAllSupplier,
  ViewAllCustomer,
} = require("../../helper/CardList/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const viewAllCardList = async (req, res) => {
  try {
    const result = await ViewAll(req, res);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List"
    );
  }
};

const FetchOneList = async (req, res) => {
  try {
    const { idContact } = req.params;
    const result = await ViewOne(req, res, idContact);
    const temp = result.toJSON();
    temp.ID = temp._ID;

    return successResponse(res, httpStatus.ok, "Success Fetch One List", temp);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed One List"
    );
  }
};

const fetchSupplierForPurchaseOrder = async (req, res) => {
  try {
    const { idPo } = req.params;
    const result = await ViewAllSupplier(res);

    const ContactMap = [];

    for (const iterator of result) {
      const contact = iterator.toJSON();

      if (contact?.PurchaseOrder?.id === idPo || !contact?.PurchaseOrder) {
        ContactMap.push(contact);
      }
    }

    return successResponse(
      res,
      httpStatus.ok,
      "Success Fetch Supplier",
      ContactMap
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Supplier"
    );
  }
};

const fetchCustomerForSalesOrder = async (req, res) => {
  try {
    const { idSo } = req.params;
    const result = await ViewAllCustomer();

    const CustomerMap = [];

    for (const iterator of result) {
      const contact = iterator.toJSON();

      if (contact?.SalesOrder?.id == idSo || !iterator.SalesOrder) {
        CustomerMap.push(contact);
      }
    }

    return successResponse(
      res,
      httpStatus.ok,
      "Success Get List Of Customer",
      CustomerMap
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "failed To Fetch List Of Customer"
    );
  }
};

module.exports = {
  viewAllCardList,
  FetchOneList,
  fetchSupplierForPurchaseOrder,
  fetchCustomerForSalesOrder,
};
