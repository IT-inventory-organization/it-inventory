const { ActivityUser } = require("../helper/Activity.interface");
const Crypt = require("../helper/encription");

module.exports = (router) => {
  router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      data: Crypt.AESEncrypt(ActivityUser.LAccessModule),
    });
  });
};
