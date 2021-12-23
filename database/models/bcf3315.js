'use strict'
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const bcf3315 = db.define('bcf3315', {
    poId: {
        type: Sequelize.INTEGER,
        // autoIncrement: true,
        allowNull: false
    },
    nomorPO: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    penanggungJawab : {
        type: Sequelize.STRING,
        allowNull: false
    },
    jabatan: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nomorFormBcf3315 : {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lampiran: {
        type: Sequelize.STRING,
        allowNull: false
    },
    npwp: {
        type: Sequelize.STRING,
        allowNull: false
    },
    alamat: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nama: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lokasiPLB: {
        type: Sequelize.STRING,
        allowNull: false
    },
    caraPengangkutan: {
        type: Sequelize.STRING,
        defaultValue: 'Laut',
        allowNull: false
    },
    pelabuhanMuat: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tanggalPerkiraan: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    namaPengangkutKeLuar: {
        type: Sequelize.STRING,
        allowNull: false
    },
    voyage: {
        type: Sequelize.STRING,
        allowNull: false
    },
    callSign: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nomorbcf3314: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    alasan: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}, {
    tableName: 'bcf3315',
    freezeTableName: true
})

module.exports = bcf3315;