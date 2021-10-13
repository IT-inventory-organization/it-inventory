'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Barang = db.define('Barang', {
  posTarif: Sequelize.DECIMAL,
  hsCode: Sequelize.STRING,
  uraian: Sequelize.STRING,
  nettoBrutoVolume: Sequelize.DECIMAL,
  satuanKemasan: Sequelize.STRING,
  nilaiPabeanHargaPenyerahan: Sequelize.DECIMAL,
  quantity: Sequelize.INTEGER,
  isDelete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  },
}, {
  modelName: 'Barang',
  freezeTableName: true
});

module.exports = Barang;