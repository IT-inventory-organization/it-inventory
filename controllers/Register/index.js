const { body, validationResult } = require("express-validator");
const { passwordFormat, checkPhoneNumber } = require("../../helper/validation");
const { createHashText } = require("../../helper/bcrypt");
const User = require("../../database/models/user");
const { Op, Transaction } = require("sequelize");
const { errorResponse, successResponse } = require("../../helper/Response");
const httpStatus = require("../../helper/Httplib");
const Encryption = require("../../helper/encription");
const { ActivityUser } = require("../../helper/Activity.interface");
const {
  addPrivilages,
  softDeleteUserPrivilages,
} = require("../../helper/UserPrivilages");
const authentication = require("../../middlewares/authentication");
const sequelize = require("../../configs/database");
const UserPrivilages = require("../../database/models/userPrivilages");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermission } = require("../../middlewares/permission");
const { json } = require("express/lib/response");

const checkInputRegister = [
  body("name").notEmpty().trim().withMessage("Name Is Required"),
  body("npwp").notEmpty().trim().withMessage("NPWP Is Required"),
  body("address").notEmpty().trim().withMessage("Address Is Required"),
  body("email").notEmpty().isEmail().withMessage("Email is Required").trim(),
  body("mobile_phone")
    .notEmpty()
    .withMessage("Mobile Phone Number Is Required")
    .trim()
    .custom(checkPhoneNumber),
  body("username").notEmpty().withMessage("Username is Required").trim(),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("Password is Required")
    .trim()
    .custom((value) => passwordFormat(value)),
  body("phone")
    .notEmpty()
    .custom(checkPhoneNumber)
    .withMessage("Phone Number is Required")
    .trim(),
  body("confirmPassword")
    .optional()
    .custom((value, { req }) => {
      if (typeof value === "undefined" || value.length == 0) {
        throw new Error("Confirm Password Cannot Empty");
      }
      if (value !== req.body.password) {
        throw new Error("Password Confirmation dose not match password");
      }
      return true;
    })
    .trim(),
  body("permission.*.accessModule")
    .trim()
    .notEmpty()
    .withMessage("Access Module is Empty"),
  body("permission.*.canRead")
    .optional()
    .notEmpty()
    .withMessage("Read Access is Empty"),
  body("permission.*.canInsert")
    .optional()
    .notEmpty()
    .withMessage("Insert Access is Empty"),
  body("permission.*.canDelete")
    .optional()
    .notEmpty()
    .withMessage("Delete Access is Empty"),
  body("permission.*.canUpdate")
    .optional()
    .notEmpty()
    .withMessage("Update Access is Empty"),
  body("permission.*.canPrint")
    .optional()
    .notEmpty()
    .withMessage("Print Access is Empty"),
];

const bundleReg = (req, res, next) => {
  try {
    const Decrypt = Encryption.AESDecrypt(req.body.dataRegister);
    req.body = {
      ...Decrypt,
    };
    delete req.body.dataRegister;

    next();
  } catch (error) {
    return errorResponse(res, httpStatus.badRequest, "Falied");
  }
};

const Register = async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    let i = 1;
    if (typeof validation.array()[i] === "undefined") {
      i = 0;
    }

    return errorResponse(res, httpStatus.badRequest, validation.array()[i].msg);
  }

  const dataToInput = {
    name: req.body.name,
    address: req.body.address,
    npwp: req.body.npwp,
    email: req.body.email,
    mobile_phone: req.body.mobile_phone,
    username: req.body.username,
    password: createHashText(req.body.password), // Hashing
    is_active: true,
    phone: req.body.phone,
  };
  let t;
  try {
    // Ambil Data User
    const data = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { npwp: req.body.npwp },
          { username: req.body.username },
        ],
      },
    });

    // Jika Sudah ada
    if (data) {
      return errorResponse(
        res,
        httpStatus.badRequest,
        "User is already exists"
      );
    }

    t = await sequelize.transaction();

    const result = await User.create(dataToInput, {
      transaction: t,
      returning: true,
    });

    const boll = await _savePrivilages(req, res, result.id, t);

    if (boll.status) {
      await t.commit();
    } else {
      throw new Error(boll.reason);
    }

    return successResponse(res, httpStatus.created, "Registration Success", {
      email: req.body.email,
    });
  } catch (error) {
    if (t && t.finished != "rollback") {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Registeration Seems Failed, Please Try Again Later",
      error.message
    );
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {number | string} idUser
 * @param {Transaction} transaction
 * @param {Boolean} Update
 * @returns
 */
const _savePrivilages = async (
  req,
  res,
  idUser,
  transaction = null,
  update = false
) => {
  try {
    /**
     * @typedef {import("../../helper/Activity").UserPermission} Permission
     */

    /**
     * @type {Permission}
     */
    const { permission } = req.body;

    const Permisson = Object.entries(ActivityUser.LAccessModule);

    if (update) {
      await softDeleteUserPrivilages(idUser, [], transaction);
    }

    let totalPermission = 0;
    for (const key in permission) {
      const find = Permisson.filter((x) => x[1] == key);
      if (find.length == 0) {
        return { status: false, reason: `Privilage ${key} is Not Exists` };
      }
      permission[key].userId = idUser;
      await addPrivilages(permission[key], transaction);
      totalPermission++;
    }

    if (totalPermission != Permisson.length) {
      if (transaction && transaction.finished !== "rollback") {
        await transaction.rollback();
      }
      return { status: false, reason: "Permission Input Not Fully Completed" };
    }

    return { status: true, reason: "" };
  } catch (error) {
    if (transaction && transaction.finished !== "rollback") {
      await transaction.rollback();
    }
    return { status: false, reason: "Server Error" };
  }
};

const GetDetaUser = async (req, res) => {
  try {
    const data = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { npwp: req.body.npwp },
          { username: req.body.username },
        ],
      },
      exclude: ["createdAt", "updatedAt"],
      include: [
        {
          model: UserPrivilages,
          where: { isDelete: false },
          exclude: ["createdAt", "updatedAt"],
        },
      ],
    });
    return successResponse(res, httpStatus.ok, "", data);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

const getUserPerId = async (req, res) => {
  try {
    const staticModule = ActivityUser.LAccessModule;
    const { idUser } = req.params;

    const result = await User.findOne({
      where: {
        id: idUser,
        is_active: true,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: [
        {
          model: UserPrivilages,
          where: {
            isDelete: false,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "userId"],
          },
          required: false,
        },
      ],
    });

    const permission = {};

    // Jika User Privilages Kosong Maka Buat Baru Dengan Default
    if (!result.UserPrivilages || result.UserPrivilages.length == 0) {
      setPermissionDefault(staticModule, permission);
    } else {
      const tempPermission = [];
      for (const iterator of result.UserPrivilages) {
        const jsonResult = iterator.toJSON();
        permission[jsonResult.accessModule] = { ...jsonResult };
        tempPermission.push(jsonResult.accessModule);
      }

      if (tempPermission.length !== staticModule.length) {
        setMissingPermission(staticModule, tempPermission, permission);
      }
    }

    let temp = result.toJSON(); // Temporary Pointer
    delete temp.UserPrivilages;
    temp = { ...temp, permission: permission };

    return successResponse(res, httpStatus.ok, "", temp);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One User"
    );
  }
};

const setPermissionDefault = (staticModule, permission) => {
  for (const iterator of staticModule) {
    const objPermission = {
      accessModule: iterator,
      canRead: false,
      canInsert: false,
      canUpdate: false,
      canDelete: false,
      canPrint: false,
    };
    permission[iterator] = objPermission;
  }
};

const setMissingPermission = (staticModule, tempPermission, permission) => {
  for (const iterator of staticModule) {
    const find = tempPermission.find((fn) => fn === iterator);
    if (!find) {
      const objPermission = {
        accessModule: iterator,
        canRead: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false,
        canPrint: false,
      };
      permission[iterator] = objPermission;
    }
  }
};

const ListUser = async (req, res) => {
  try {
    const result = await User.findAll({
      where: {
        is_active: true,
      },
      include: [
        {
          model: UserPrivilages,
          where: { isDelete: false },
          attributes: [],
          required: false,
        },
      ],
      attributes: ["id", "name", "username", "email"],
    });

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

const UpdateUser = async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    let i = 1;
    if (typeof validation.array()[i] === "undefined") {
      i = 0;
    }

    return errorResponse(res, httpStatus.badRequest, validation.array()[i].msg);
  }

  let dataToInput = {
    name: req.body.name,
    address: req.body.address,
    npwp: req.body.npwp,
    email: req.body.email,
    mobile_phone: req.body.mobile_phone,
    username: req.body.username,
    // password: createHashText(req.body.password  ), // Hashing
    is_active: true,
    phone: req.body.phone,
  };

  if (req.body.password) {
    dataToInput.password = createHashText(req.body.password);
  }

  let t;
  try {
    const { idUser } = req.params;

    // Ambil Data User
    const data = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { npwp: req.body.npwp },
          { username: req.body.username },
        ],
      },
    });

    // Jika Sudah ada
    if (!data) {
      return errorResponse(res, httpStatus.badRequest, "User is Not Exist");
    }

    t = await sequelize.transaction();

    const result = await User.update(dataToInput, {
      where: {
        id: idUser,
        is_active: true,
      },
      transaction: t,
      returning: true,
    });

    const boll = await _savePrivilages(req, res, idUser, t, true);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update User",
          sourceId: idUser,
          sourceType: ActivityUser.User,
          userId: req.currentUser,
        },
        t
      );
    }

    if (boll.status) {
      await t.commit();
    } else {
      throw new Error(boll.reason);
    }

    return successResponse(res, httpStatus.created, "Update Success", {
      email: req.body.email,
    });
  } catch (error) {
    if (t && t.finished != "rollback") {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Update Seems Failed, Please Try Again Later",
      error.message
    );
  }
};

module.exports = (routes) => {
  routes.post("/", bundleReg, checkInputRegister, Register);
  routes.get("/:idUser", authentication, getUserPerId);
  routes.put(
    "/:idUser",
    authentication,
    bundleReg,
    checkInputRegister,
    UpdateUser
  );
  routes.get("/list/user", authentication, ListUser);
};
