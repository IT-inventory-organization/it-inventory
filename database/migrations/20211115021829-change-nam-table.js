'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promises = [
      await queryInterface.renameTable('berat_dan_volume', 'beratDanVolume'),
      await queryInterface.renameTable('data_barang', 'dataBarang'),
      await queryInterface.renameTable('data_kapal', 'dataKapal'),
      await queryInterface.renameTable('data_pelabuhan', 'dataPelabuhan'),
      await queryInterface.renameTable('data_pengangkutan', 'dataPengangkutan'),
      await queryInterface.renameTable('dokumen_pemasukan', 'dokumenPemasukan'),
      await queryInterface.renameTable('dokumen_tambahan', 'dokumenTambahan'),
      await queryInterface.renameTable('identitas_barang', 'identitasBarang'),
      await queryInterface.renameTable('info_pengguna', 'infoPengguna'),
      await queryInterface.renameTable('mata_uang', 'mataUang'),
      await queryInterface.renameTable('pembeli_barang', 'pembeliBarang'),
      await queryInterface.renameTable('pengirim_barang', 'pengirimBarang'),
      await queryInterface.renameTable('pengusaha_PLB', 'pengusahaPLB'),
      await queryInterface.renameTable('penjual-barang', 'penjualBarang'),
      await queryInterface.renameTable('reports', 'report'),
      await queryInterface.renameTable('tempat_penimbunan', 'tempatPenimbunan')
    ];
    return Promise.all(promises)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const promises = [
      await queryInterface.renameTable('beratDanVolume', 'berat_dan_volume'),
      await queryInterface.renameTable('dataBarang', 'data_barang'),
      await queryInterface.renameTable('dataKapal', 'data_kapal'),
      await queryInterface.renameTable('dataPelabuhan', 'data_pelabuhan'),
      await queryInterface.renameTable('dataPengangkutan', 'data_pengangkutan'),
      await queryInterface.renameTable('dokumenPemasukan', 'dokumen_pemasukan'),
      await queryInterface.renameTable('dokumenTambahan', 'dokumen_tambahan'),
      await queryInterface.renameTable('identitasBarang', 'identitas_barang'),
      await queryInterface.renameTable('infoPengguna', 'info_pengguna'),
      await queryInterface.renameTable('mataUang', 'mata_uang'),
      await queryInterface.renameTable('pembeliBarang', 'pembeli_barang'),
      await queryInterface.renameTable('pengirimBarang', 'pengirim_barang'),
      await queryInterface.renameTable('pengusahaPLB', 'pengusaha_PLB'),
      await queryInterface.renameTable('penjualBarang', 'penjual-barang'),
      await queryInterface.renameTable('report', 'reports'),
      await queryInterface.renameTable('tempatPenimbunan', 'tempat_penimbunan')
    ];

    return Promise.all(promises);
  }
};
