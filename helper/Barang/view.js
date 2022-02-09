const { Op } = require("sequelize");
const Barang = require("../../database/models/barang");

const getBarang = async (req, res) => {
  try {
    return Barang.findAll({
      attributes: ["id", "name", "satuanKemasan"],
      where: {
        stock: {
          [Op.gte]: 0,
        },
        isDelete: false,
      },
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Something's Wrong"
    );
  }
};

module.exports = {
  getBarang,
};
