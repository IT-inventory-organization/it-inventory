const { errorResponse, successResponse } = require("../../helper/Response");
const { deleteReport } = require("../../helper/DataReport");
const {
  createUserActivity,
  CreateActivityUser,
} = require("../../helper/UserActivity");
const Http = require("../../helper/Httplib");
const authentication = require("../../middlewares/authentication");
const { ActivityUser } = require("../../helper/Activity.interface");

const deleteReportDoc = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteReport(id, req);

    // if (req.currentRole !== "Owner") {
    //   await createUserActivity(req.currentUser, id, `Deleting Report Document`);
    // }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Report",
        sourceId: id,
        sourceType: ActivityUser.PPFTZ,
        userId: req.currentUser,
      });
    }

    return successResponse(res, Http.ok, "Success Deleting Report Document");
  } catch (error) {
    return errorResponse(res, Http.internalServerError, "Gagal");
  }
};

module.exports = (routes) => {
  routes.delete("/:id", authentication, deleteReportDoc);
};
