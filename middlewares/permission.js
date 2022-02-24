const User = require("../database/models/user");
const UserPrivilages = require("../database/models/userPrivilages");
const httpStatus = require("../helper/Httplib");
const { errorResponse } = require("../helper/Response");

const CheckPermissionRead = (req, res, accessModule) => {
  return req?.permission[accessModule]?.canRead ? true : false;
};
const CheckPermissionInsert = (req, res, accessModule) => {
  return req?.permission[accessModule]?.canInsert ? true : false;
};
const CheckPermissionUpdate = (req, res, accessModule) => {
  if (CheckPermissionRead(req, res, accessModule) === false) {
    return false;
  }
  return req?.permission[accessModule]?.canUpdate ? true : false;
};
const CheckPermissionDelete = (req, res, accessModule) => {
  if (CheckPermissionRead(req, res, accessModule) === false) {
    return false;
  }
  return req?.permission[accessModule]?.canDelete ? true : false;
};

module.exports = {
  /**
   * @param {Requres} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  CheckPermission: async (req, res, next) => {
    try {
      const getPermission = await UserPrivilages.findAll({
        where: {
          userId: req.currentUser,
          isDelete: false,
        },
        attributes: {
          exclude: ["id", "createdAt", "updatedAt", "isDelete"],
        },
      });

      const permission = {};
      for (const iterator of getPermission) {
        const jsonResult = iterator.toJSON();

        permission[jsonResult.accessModule] = { ...jsonResult };
      }

      req.permission = permission;

      next();
    } catch (error) {
      return errorResponse(
        res,
        httpStatus.unauthenticated,
        "Not Authorized For Access"
      );
    }
  },
  CheckPermissionRead,
  CheckPermissionInsert,
  CheckPermissionUpdate,
  CheckPermissionDelete,
};
