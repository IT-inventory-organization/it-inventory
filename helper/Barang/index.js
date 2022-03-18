const Barang = require("../../database/models/barang");
const reportListBarang = require("../../database/models/listbarang");
const { authUser } = require("../../helper/authBarang");
const sequelize = require("../../configs/database");
const reportListDokumen = require("../../database/models/listdokumen");
const Report = require("../../database/models/report");
const reportIdentitasPenerima = require("../../database/models/identitaspenerima");
const { Op } = require("sequelize");
const Histories = require("../../database/models/history");

const findBarang = async (id, idUser = null, specificAttr = false) => {
  let query = {
    where: {
      id: id,
      isDelete: false,
    },
  };

  if (idUser !== null) {
    query = {
      ...query,
      userId: idUser,
    };
  }

  if (specificAttr) {
    query = {
      ...query,
      attributes: ["name", "posTarif", "uraian", "stock"],
    };
  }

  return Barang.findOne(query);
};

const countTotal = (arr) => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += +arr[i].count;
  }
  return total;
};

module.exports = {
  findBarang,
  createListItem: async (data, transaction = null) => {
    try {
      const result = await Barang.create(data, {
        transaction: transaction,
        returning: true,
      });

      if (!result) {
        throw new Error("Failed Create Barang");
      }

      const find = await Barang.findOne({
        where: {
          id: result.toJSON().id,
        },
        attributes: [
          "name",
          "posTarif",
          "nettoBrutoVolume",
          "hsCode",
          "satuanKemasan",
          "stock",
          ["id", "idBarang"],
          "uraian",
        ],
      });

      return find;
    } catch (error) {
      throw error;
    }
  },

  softDeleteListItem: async (req, id, transaction = null) => {
    try {
      const findItem = await findBarang(id, req.currentUser);
      if (!findItem) {
        throw new Error(`Data Not Found`);
      }
      // if (!(await authUser(Barang, id, req, true))) {
      //   throw new Error("User Is Not Authorized To Delete List Item");
      // }
      const result = await Barang.update(
        {
          isDelete: true,
        },
        {
          where: {
            id,
          },
          transaction: transaction,
          returning: true,
        }
      );
      if (result[0] == 0) {
        throw new Error(`Data Didn't Exists`);
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  updateListItem: async (req, id, data, transaction = null) => {
    try {
      const findItem = await findBarang(id, req.currentUser);

      if (!findItem) {
        throw new Error(`Data Not Found`);
      }

      if (data.id) {
        delete data.id;
      }

      const result = await Barang.update(data, {
        where: {
          id: id,
          // userId: req.currentUser,
        },
        transaction: transaction,
        returning: true,
      });

      if (!result) {
        throw new Error(`Failed Update Item`);
      }

      const found = await Barang.findOne({
        where: {
          id: id,
          userId: req.currentUser,
        },
        attributes: [
          "name",
          "posTarif",
          "nettoBrutoVolume",
          "hsCode",
          "satuanKemasan",
          "stock",
          ["id", "idBarang"],
          "uraian",
        ],
        transaction: transaction,
      });

      return found;
    } catch (error) {
      throw error;
    }
  },

  getListItem: async (
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

        let sql = `SELECT barang.name, barang.id as "idBarang", barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang.stock, barang.cbm, barang.tanggal, card.name as customer FROM "Barang" AS barang LEFT JOIN "CardList" AS card ON (barang."idCardList" = card.id) WHERE barang."isDelete" = false ${searchQuery} `;

        let countBarang = `SELECT count(*) FROM "Barang" AS barang LEFT JOIN "CardList" as card ON (barang."idCardList" = card.id) WHERE barang."isDelete" = false ${searchQuery}`;

        const result = await sequelize.query(sql);
        const count = await sequelize.query(countBarang);

        return {
          data: result[0],
          data_size: +countTotal(count[0]),
          page_size: +limit,
          page: +pageSize || 1,
        };
      }
    } catch (error) {
      throw error;
    }
  },

  updateStockItem: async (
    req,
    id,
    status = null,
    total,
    notificationType = null,
    transaction = null
  ) => {
    try {
      let query = {
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
        },
        transaction: transaction,
        returning: true,
      };
      let resultFindItem;

      if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
        resultFindItem = await findBarang(id, req.currentUser);
        query = {
          where: {
            id: id,
            userId: req.currentUser,
          },
          ...query,
        };
      } else {
        resultFindItem = await findBarang(id);
        query = {
          where: {
            id: id,
          },
          ...query,
        };
      }

      if (!resultFindItem) {
        throw new Error(`Data Not Found`);
      }

      let quantity = resultFindItem.stock;

      if (status != null) {
        if (/(increase)/gi.test(status)) {
          quantity += +total;
        } else if (/(decrease)/gi.test(status)) {
          quantity -= +total;
          if (quantity < 0) {
            throw new Error(`Stock ${resultFindItem.name} is Too Low`);
          }
        }
      } else if (notificationType != null) {
        if (/(export)/gi.test(notificationType)) {
          quantity -= +total;

          if (quantity < 0) {
            throw new Error(`Stock ${resultFindItem.name} is Too Low`);
          }
        } else if (/(import)/gi.test(notificationType)) {
          quantity += +total;
        }
      }

      const result = await Barang.update(
        {
          stock: quantity,
        },
        query
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  getOneHistoryOnItem: async (req, idBarang) => {
    try {
      let query = {
        where: {
          userId: req.currentUser,
        },
        attributes: {
          include: ["uraian"],
        },
      };
      if (idBarang) {
        query = {
          where: {
            ...query.where,
            id: idBarang,
          },
        };
      }
      query = {
        ...query,
        include: [
          {
            model: reportListBarang,
            attributes: {
              exclude: ["createdAt", "updatedAt", "idBarang", "reportId"],
            },
            include: {
              model: Report,
              attributes: {
                exclude: [
                  "pengajuanSebagai",
                  "kantorPengajuan",
                  "jenisMasuk",
                  "isEditable",
                  "userId",
                  "isDelete",
                  "createdAt",
                ],
              },
              include: [
                {
                  model: reportListDokumen,
                  attributes: {
                    include: ["nomorDokumen"],
                  },
                },
                {
                  model: reportIdentitasPenerima,
                  attributes: {
                    include: ["namaPenerima"],
                  },
                },
              ],
            },
          },
        ],
      };

      query.attributes = [["id", "idBarang"]];

      const result = await Barang.findOne(query);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
