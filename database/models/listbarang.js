'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

// const reportListBarang = db.define('listBarang', {
//   posTarif: {
//     type: Sequelize.DECIMAL
//   },
//   uraian: {
//     type: Sequelize.STRING
//   },
//   nettoBrutoVolume: {
//     type: Sequelize.DECIMAL
//   },
//   satuanKemasan: {
//     type: Sequelize.STRING
//   },
//   nilaiPabeanHargaPenyerahan: {
//     type: Sequelize.DECIMAL
//   },
//   hsCode: {
//     type: Sequelize.STRING,
//   },
//   isDelete: {
//     type: Sequelize.BOOLEAN,
//   },
//   reportId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: "Reports",
//       key: "id"
//     },
//     onDelete: "cascade",
//     onUpdate: "cascade"
//   }
// }, {
//   tableName: 'listBarang',
//   freezeTableName:true,
// })

// module.exports = reportListBarang;
const reportListBarang = db.define('listBarang', {
  idBarang: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Barang',
      key: "id"
    },
    onUpdate: "cascade",
    onDelete: "cascade"
  },
  reportId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
  nilaiPabeanHargaPenyerahan: {
    type: Sequelize.DECIMAL
  }
}, {
  tableName: 'listBarang',
  freezeTableName:true,
})

module.exports = reportListBarang;