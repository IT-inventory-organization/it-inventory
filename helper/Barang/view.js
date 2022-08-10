const { Op } = require("sequelize");
const sequelize = require("../../configs/database");
const Barang = require("../../database/models/barang");

const getBarang = async (req, res) => {
  try {
    return Barang.findAll({
      // attributes: ["id", "name", "satuanKemasan", "cbm", "nett"],
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
  getInfiniteScroll: async (
    req,
    param = { id: null, search: null, pageSize: 10, pageNo: 1 }
  ) => {
    try {
      let searchQuery = ``;

      const { id, search, pageSize, pageNo } = param;
      let user = `AND barang.id = ${id}`;

      const limit = pageSize ? +pageSize : 10;
      const offset = pageNo ? (+pageNo - 1) * pageSize : 0;

      // if(id){
      //     if(!await authUser(Barang, id, req, true)){
      //         throw new Error(`User is Not Authorized To Access Data`)
      //     }
      //     user+=`AND barang."userId" = ${req.currentUser} AND barang.id = ${id}`;
      // }else{
      //     user+=`AND barang."userId" = ${req.currentUser}`;
      // }

      if (search) {
        const column = [
          "name",
          "posTarif",
          "hsCode",
          "uraian",
          "satuanKemasan",
          "nettoBrutoVolume",
          "stock",
          "cbm",
          "tanggal",
        ];
        searchQuery += `AND (`;
        for (let i = 0; i < column.length; i++) {
          const regex = new RegExp(/[A-Z]/g);
          if (regex.test(column[i])) {
            if (i == column.length - 1) {
              searchQuery += ` barang."${column[i]}"::text ILIKE '%${search}%' `;
              continue;
            }
            searchQuery += ` barang."${column[i]}"::text ILIKE '%${search}%' OR`;
          } else {
            if (i == column.length - 1) {
              searchQuery += ` barang.${column[i]}::text ILIKE '%${search}%' `;
              continue;
            }
            searchQuery += ` barang.${column[i]}::text ILIKE '%${search}%' OR `;
          }
        }
        searchQuery += `OR card.name::text ILIKE '%${search}%'`;
        searchQuery += `)`;
      }

      if (id) {
        let sql = `SELECT barang.name, barang.id as "idBarang", barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang.stock, barang.cbm, barang.tanggal, card.name as customer, card.id FROM "Barang" AS barang LEFT JOIN "CardList" as card ON (barang."idCardList" = card.id) WHERE barang."isDelete" = false ${user}`;
        // console.log(sql);
        const result = await sequelize.query(sql);
        return result[0];
      } else {
        let qry = "";

        if (pageSize == -1 || pageSize == "-1") {
          qry = "";
        } else {
          qry = `LIMIT ${limit} OFFSET ${offset}`;
        }

        let sql = `SELECT barang.name, barang.id as "idBarang", barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang.stock, barang.cbm, barang.tanggal, card.name as customer FROM "Barang" AS barang LEFT JOIN "CardList" AS card ON (barang."idCardList" = card.id) WHERE barang."isDelete" = false ${searchQuery}`;
        console.log(sql);
        let countBarang = `SELECT count(*) FROM "Barang" AS barang LEFT JOIN "CardList" as card ON (barang."idCardList" = card.id) WHERE barang."isDelete" = false ${searchQuery}`;

        const result = await sequelize.query(sql);
        const count = await sequelize.query(countBarang);

        return {
          data: result[0],
          data_size: +countTotal(count[0]),
          page_size: +pageSize,
          page: +pageNo || 1,
        };
      }
    } catch (error) {
      throw error;
    }
  },
};
