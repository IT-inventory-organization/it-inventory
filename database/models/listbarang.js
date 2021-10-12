'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

// const reportListBarang = db.define('listBarang', {
//   jenisIdentitasPengirim: {
//     type: Sequelize.STRING
//   },
//   nomorIdentitasPengirim: {
//     type: Sequelize.STRING
//   },
//   namaPengirim: {
//     type: Sequelize.STRING
//   },
//   alamatPengirim: {
//     type: Sequelize.STRING
//   },
//   nomorIjinBpkPengirim: {
//     type: Sequelize.STRING
//   },
//   tanggalIjinBpkPengirim: {
//     type: Sequelize.DATEONLY
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
const reportListBarang = db.define('listBarang', {
  posTarif: {
    type: Sequelize.DECIMAL
  },
  uraian: {
    type: Sequelize.STRING
  },
  nettoBrutoVolume: {
    type: Sequelize.DECIMAL
  },
  satuanKemasan: {
    type: Sequelize.STRING
  },
  nilaiPabeanHargaPenyerahan: {
    type: Sequelize.DECIMAL
  },
  hsCode: {
    type: Sequelize.STRING,
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
  },
  reportId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  }
}, {
  tableName: 'listBarang',
  freezeTableName:true,
})

module.exports = reportListBarang;