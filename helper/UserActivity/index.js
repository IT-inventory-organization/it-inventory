const Report = require("../../database/models/report")
const User = require("../../database/models/user")
const UserActivity = require("../../database/models/useractivity")

const createUserActivity = async(userId, reportId, activity) => {
  try {
    const payload = {
      userId, reportId, activity
    }
    const result = await UserActivity.create(payload)
    return true
  } catch (error) {
    return false
  }
}

const getUserActivity = async() => {
  try {
    const result = await UserActivity.findAll({
      include: [Report, User]
    })
    return result
  } catch (error) {
    return error
  }
}

module.exports = {}