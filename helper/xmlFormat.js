const DocumentPemasukan = (data) => {
    let xml = `\t<id>${data.id}`;
    xml += `\t<reportId>${data.reportId}</reportId>`;
    xml += `\t<nomorDokumenPemasukan>${data.nomorDokumenPemasukan}</nomorDokumenPemasukan>`;
    xml += `\t<tanggalDokumenPemasukan>${data.tanggalDokumenPemasukan}</tanggalDokumenPemasukan>`;

    return xml;
}

const DocumentPengeluaran = data => {
    let xml = `\t<id>${data.id}`;
    xml += `\t<reportId>${data.reportId}</reportId>`;
    xml += `\t<nomorDokumen>${data.nomorDokumenPemasukan}</nomorDokumen>`;
    xml += `\t<tanggalDokumen>${data.tanggalDokumenPemasukan}</tanggalDokumen>`;

    return xml;
}

const InReport = (data) => {
    let xml = `\t<report>`;
    xml += `\t\t<id>${data.report.id}</id>`;
    xml += `\t\t<jenisPemberitahuan>${data.report.jenisPemberitahuan}</jenisPemberitahuan>`;
    xml += `\t\t<diAjukanDiKantor>${data.report.diAjukanDiKantor}</diAjukanDiKantor>`;
    xml += `\t\t<jenisDokumenBC>${data.report.jenisDokumenBC}</jenisDokumenBC>`;
    xml += `\t\t<userId>${data.report.userId}</userId>`;
    xml += DocumentTambahan(data);
    xml += DataPelabuhan(data);
    xml += DataKapal(data);
    xml += IdentityItem(data);
    xml += ItemSeller(data);
    xml += PLBBusinessMan(data);
    xml += Courier(data);
    xml += Buyer(data);
    xml += PPJK(data);
    xml += Currency(data);
    xml += DataTransportation(data);
    xml += WeightAndVolume(data);
    xml += Dump(data);
    xml += Items(data);
    xml += `\t</report>`;

    return xml;
}

const OutReport = data => {
    let xml = `\t<report>`;
    xml += `\t\t<id>${data.report.id}</id>`;
    xml += `\t\t<jenisPemberitahuan>${data.report.jenisPemberitahuan}</jenisPemberitahuan>`;
    xml += `\t\t<diAjukanDiKantor>${data.report.diAjukanDiKantor}</diAjukanDiKantor>`;
    xml += `\t\t<jenisDokumenBC>${data.report.jenisDokumenBC}</jenisDokumenBC>`;
    xml += `\t\t<userId>${data.report.userId}</userId>`;
    xml += DocumentTambahan(data);
    xml += DataPelabuhan(data);
    xml += DataKapal(data);
    xml += IdentityItem(data);
    xml += ItemSeller(data);
    xml += PLBBusinessMan(data);
    xml += Courier(data);
    xml += Buyer(data);
    xml += PPJK(data);
    xml += Currency(data);
    xml += DataTransportation(data);
    xml += WeightAndVolume(data);
    xml += Items(data);
    xml += `\t</report>`;

    return xml;
}

const DocumentTambahan = (data) => {
    let xml = `\t\t<dokumenTambahan>`;
    xml += `\t\t\t<id>${data.report.dokumenTambahan.id}</id>`;
    xml += `\t\t\t<nomorBC10>${data.report.dokumenTambahan.nomorBC10}</nomorBC10>`;
    xml += `\t\t\t<nomorBC11>${data.report.dokumenTambahan.nomorBC11}</nomorBC11>`;
    xml += `\t\t\t<nomorBL>${data.report.dokumenTambahan.nomorBL}</nomorBL>`;
    xml += `\t\t\t<tanggalBC10>${data.report.dokumenTambahan.tanggalBC10}</tanggalBC10>`;
    xml += `\t\t\t<tanggalBC11>${data.report.dokumenTambahan.tanggalBC11}</tanggalBC11>`;
    xml += `\t\t\t<tanggalBL>${data.report.dokumenTambahan.tanggalBL}</tanggalBL>`;
    xml += `\t\t</dokumenTambahan>`;

    return xml;
}

const DataPelabuhan = (data) => {
    let xml = `\t\t<dataPelabuhan>`;
    xml += `\t\t\t<id>${data.report.dataPelabuhan.id}</id>`;
    xml += `\t\t\t<pelabuhan>${data.report.dataPelabuhan.pelabuhan}</pelabuhan>`;
    xml += `\t\t\t<status>${data.report.dataPelabuhan.status}</status>`;
    xml += `\t\t</dataPelabuhan>`;

    return xml;
}

const DataKapal = (data) => {
    let xml = `\t\t<dataKapal>`;
    xml += `\t\t\t<id>${data.report.dataKapal.id}</id>`;
    xml += `\t\t\t<voyageKapal>${data.report.dataKapal.voyageKapal}</voyageKapal>`;
    xml += `\t\t\t<benderaKapal>${data.report.dataKapal.benderaKapal}</benderaKapal>`;
    xml += `\t\t\t<namaKapal>${data.report.dataKapal.namaKapal}</namaKapal>`;
    xml += `\t\t\t<tanggalKedatangan>${data.report.dataKapal.tanggalKedatangan}</tanggalKedatangan>`;
    xml += `\t\t\t<tanggalKeberangkatan>${data.report.dataKapal.tanggalKeberangkatan}</tanggalKeberangkatan>`;
    xml += `\t\t</dataKapal>`;

    return xml;
}

const IdentityItem = (data) => {
    let xml = `\t\t<identitasBarang>`;
    xml += `\t\t\t<id>${data.report.identitasBarang.id}</id>`;
    xml += `\t\t\t<negaraAsal>${data.report.identitasBarang.negeraAsal}</negaraAsal>`;
    xml += `\t\t\t<jenisBarang>${data.report.identitasBarang.jenisBarang}</jenisBarang>`;
    xml += `\t\t\t<nilaiBarang>${data.report.identitasBarang.nilaiBarang}</nilaiBarang>`;
    xml += `\t\t\t<caraPembayaran>${data.report.identitasBarang.caraPembayaran}</caraPembayaran>`;
    xml += `\t\t\t<asalBarang>${data.report.identitasBarang.asalBarang}</asalBarang>`;
    xml += `\t\t\t<jumlahBarang>${data.report.identitasBarang.jumlahBarang}</jumlahBarang>`;
    xml += `\t\t\t<jumlahKemasan>${data.report.identitasBarang.jumlahKemasan}</jumlahKemasan>`;
    xml += `\t\t</identitasBarang>`;

    return xml;
}

const ItemSeller = (data) => {
    let xml = '\t\t<penjualBarang>';
    xml += `\t\t\t<id>${data.report.penjualBarang.id}</id>`;
    xml += `\t\t\t<<jenisIdentitasPenjual>${data.report.penjualBarang.jenisIdentitasPenjual}</jenisIdentitasPenjual>>`;
    xml += `\t\t\t<namaPenjual>${data.report.penjualBarang.namaPenjual}</namaPenjual>`;
    xml += `\t\t\t<nomorIdentitasPenjual>${data.report.penjualBarang.nomorIdentitasPenjual}</nomorIdentitasPenjual>`;
    xml += `\t\t\t<alamatPenjual>${data.report.penjualBarang.alamatPenjual}</alamatPenjual>`;
    xml += `\t\t</penjualBarang>`;

    return xml;
}

const PLBBusinessMan = (data) => {
    let xml = `\t\t<pengusahaPLB>`;
    xml += `\t\t\t<id>${data.report.pengusahaPLB.id}</id>`;
    xml += `\t\t\t<jenisIdentitasPengusahaPLB>${data.report.pengusahaPLB.jenisIdentitasPengusahaPLB}</jenisIdentitasPengusahaPLB>`;
    xml += `\t\t\t<namaPengusahaPLB>${data.report.pengusahaPLB.namaPengusahaPLB}</namaPengusahaPLB>`;
    xml += `\t\t\t<nomorIdentitasPengusahaPLB>${data.report.pengusahaPLB.nomorIdentitasPengusahaPLB}</nomorIdentitasPengusahaPLB>`;
    xml += `\t\t\t<alamatPengusahaPLB>${data.report.pengusahaPLB.alamatPengusahaPLB}</alamatPengusahaPLB>`;
    xml += `\t\t</pengusahaPLB>`;

    return xml;
}

const Courier = (data) => {
    let xml = `\t\t<pengirimBarang>`;
    xml += `\t\t\t<id>${data.report.pengirimBarang.id}</id>`;
    xml += `\t\t\t<jenisIdentitasPengirim>${data.report.pengirimBarang.jenisIdentitasPengirim}</jenisIdentitasPengirim>`;
    xml += `\t\t\t<namaPengirim>${data.report.pengirimBarang.namaPengirim}</namaPengirim>`;
    xml += `\t\t\t<nomorIdentitasPengirim>${data.report.pengirimBarang.nomorIdentitasPengirim}</nomorIdentitasPengirim>`;
    xml += `\t\t\t<alamatPengirim>${data.report.pengirimBarang.alamatPengirim}</alamatPengirim>`;
    xml += `\t\t<pengirimBarang>`;

    return xml;
}

const Buyer = (data) => {
    let xml = `\t\t<pembeliBarang>`;
    xml += `\t\t\t<id>${data.report.pembeliBarang.id}</id>`;
    xml += `\t\t\t<jenisIdentitasPembeli>${data.report.pembeliBarang.jenisIdentitasPembeli}</jenisIdentitasPembeli>`;
    xml += `\t\t\t<namaPembeli>${data.report.pembeliBarang.namaPembeli}</namaPembeli>`;
    xml += `\t\t\t<nomorIdentitasPembeli>${data.report.pembeliBarang.nomorIdentitasPembeli}</nomorIdentitasPembeli>`;
    xml += `\t\t\t<alamatPembeli>${data.report.pembeliBarang.alamatPembeli}</alamatPembeli>`;
    xml += `\t\t</pembeliBarang>`;

    return xml;
}

const PPJK = data => {
    let xml = `\t\t<ppjk>`;
    xml += `\t\t\t<id>${data.report.ppjk.id}</id>`;
    xml += `\t\t\t<jenisIdentitasPpjk>${data.report.ppjk.jenisIdentitasPpjk}</jenisIdentitasPpjk>`;
    xml += `\t\t\t<namaPpjk>${data.report.ppjk.namaPpjk}</namaPpjk>`;
    xml += `\t\t\t<nomorIdentitasPpjk>${data.report.ppjk.nomorIdentitasPpjk}</nomorIdentitasPpjk>`;
    xml += `\t\t\t<alamatPpjk>${data.report.ppjk.alamatPpjk}</alamatPpjk>`;
    xml += `\t\t</ppjk>`;

    return xml;
}

const Currency = data => {
    let xml = `\t\t<mataUang>`;
    xml += `\t\t\t<id>${data.report.mataUang.id}</id>`;
    xml += `\t\t\t<valuta>${data.report.mataUang.valuta}</valuta>`;
    xml += `\t\t\t<freight>${data.report.mataUang.freight}</freight>`;
    xml += `\t\t\t<ndbpmKurs>${data.report.mataUang.ndbpmKurs}</ndbpmKurs>`;
    xml += `\t\t\t<cif>${data.report.mataUang.cif}</cif>`;
    xml += `\t\t\t<transaksiLainnya>${data.report.mataUang.transaksiLainnya}</transaksiLainnya>`;
    xml += `\t\t\t<hargaPenyerahan>${data.report.mataUang.hargaPenyerahan}</hargaPenyerahan>`;
    xml += `\t\t</mataUang>`;

    return xml;
}

const DataTransportation = data => {
    let xml = `\t\t<dataPengangkutan>`;
    xml += `\t\t\t<id>${data.report.dataPengangkutan.id}</id>`;
    xml += `\t\t\t<caraAngkut>${data.report.dataPengangkutan.caraAngkut}</caraAngkut>`;
    xml += `\t\t\t<bendera>${data.report.dataPengangkutan.bendera}</bendera>`;
    xml += `\t\t\t<namaPengangkut>${data.report.dataPengangkutan.namaPengangkut}</namaPengangkut>`;
    xml += `\t\t\t<nomorVoyFlightPol>${data.report.dataPengangkutan.nomorVoyFlightPol}</nomorVoyFlightPol>`;
    xml += `\t\t</dataPengangkutan>`;

    return xml;
}

const WeightAndVolume = data => {
    let xml = `\t\t<beratDanVolume>`;
    xml += `\t\t\t<id>${data.report.beratDanVolume.id}</id>`;
    xml += `\t\t\t<beratMuatan>${data.report.beratDanVolume.beratMuatan}</beratMuatan>`;
    xml += `\t\t\t<beratKapalDenganMuatan>${data.report.beratDanVolume.beratKapalDenganMuatan}</beratKapalDenganMuatan>`;
    xml += `\t\t\t<volume>${data.report.beratDanVolume.volume}</volume>`;
    xml += `\t\t</beratDanVolume>`;

    return xml;
}

const Dump = data => {
    let xml = `\t\t<tempatPenimbunan>`;
    xml += `\t\t\t<id>${data.report.tempatPenimbunan.id}</id>`;
    xml += `\t\t\t<tempatPenimbunan>${data.report.tempatPenimbunan.tempatPenimbunan ? data.report.tempatPenimbunan.tempatPenimbunan : data.report.tempatPenimbunan.dataKapal.namaKapal}</tempatPenimbunan>`;
    xml += `\t\t\t<perkiraanTanggalPengeluaran>${data.report.tempatPenimbunan.perkiraanTanggalPengeluaran}</perkiraanTanggalPengeluaran>`;
    xml += `\t\t\t<idKapal>${data.report.tempatPenimbunan.idKapal}</idKapal>`;
    xml += `\t\t</tempatPenimbunan>`;

    return xml;
}

const Items = data => {
    let xml = `\t\t<dataBarang>`;

    for (const key in data.report.dataBarangs) {
        xml += `\t\t\t<barang>`;
        xml += `\t\t\t\t<id>${data.report.dataBarangs[key].id}</id>`;
        xml += `\t\t\t\t<kodeBarang>${data.report.dataBarangs[key].kodeBarang}</kodeBarang>`;
        xml += `\t\t\t\t<namaBarang>${data.report.dataBarangs[key].namaBarang}</namaBarang>`;
        xml += `\t\t\t\t<uraian>${data.report.dataBarangs[key].uraian}</uraian>`;
        xml += `\t\t\t\t<nettoBruttoVolume>${data.report.dataBarangs[key].nettoBruttoVolume}</nettoBruttoVolume>`;
        xml += `\t\t\t\t<satuanKemasan>${data.report.dataBarangs[key].satuanKemasan}</satuanKemasan>`;
        xml += `\t\t\t\t<stock>${data.report.dataBarangs[key].stock}</stock>`;
        xml += `\t\t\t\t<posTarif>${data.report.dataBarangs[key].posTarif}</posTarif>`;
        xml += `\t\t\t\t<bm>${data.report.dataBarangs[key].bm}</bm>`;
        xml += `\t\t\t\t<ppn>${data.report.dataBarangs[key].ppn}</ppn>`;
        xml += `\t\t\t\t<ppnbm>${data.report.dataBarangs[key].ppnbm}</ppnbm>`;
        xml += `\t\t\t\t<cukai>${data.report.dataBarangs[key].cukai}</cukai>`;
        xml += `\t\t\t\t<nilaiPabeanHargaPenyerahan>${data.report.dataBarangs[key].nilaiPabeanHargaPenyerahan ? data.report.dataBarangs[key].nilaiPabeanHargaPenyerahan : ''}</nilaiPabeanHargaPenyerahan>`;
    }
    xml += `\t\t</dataBarang>`;

    return xml;
}

const XMLPemasukan = (data) => {
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>`;
    xml += '\t<root>';
    xml += DocumentPemasukan(data);
    xml += InReport(data);

    return xml;
}

const XMLPengeluaran = data => {
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>`;
    xml += '\t<root>';
    xml += DocumentPengeluaran(data);
    xml += OutReport(data);

    return xml;
}

module.exports = {XMLPemasukan, XMLPengeluaran}