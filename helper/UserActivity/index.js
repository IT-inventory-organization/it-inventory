const Report = require("../../database/models/report");
const User = require("../../database/models/user");
const UserActivity = require("../../database/models/useractivity");

const createUserActivity = async (userId, reportId, activity) => {
  try {
    const payload = {
      userId: userId,
      reportId: reportId,
      activity: activity,
    };
    const result = await UserActivity.create(payload);
    return result;
  } catch (error) {
    return false;
  }
};

const getUserActivity = async (req) => {
  if (req.currentRole !== "Owner") {
    return "Your Not An Owner Of this Website";
  }
  try {
    const result = await UserActivity.findAll({
      include: [Report, User],
    });
    return result;
  } catch (error) {
    return error;
  }
};
/**
 *
 * @param {Object} payload
 * @param {number} payload.userId
 * @param {string} payload.activity,
 * @param {number} payload.sourceId
 * @param {string} payload.sourceType
 * @returns
 */
const CreateActivityUser = async (payload, transaction = null) => {
  return UserActivity.create(payload, {
    transaction: transaction,
  });
};

module.exports = {
  getUserActivity,
  createUserActivity,
  CreateActivityUser,
};
