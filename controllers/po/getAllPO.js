const getAllPO = {};

getAllPO.getAll = async (req, res) => {
    try {
        let data = await po.findAll ({
            attriburs : ["kapalPemilik", "kapalPembeli",
            "tanggalPurchaseOrder", "jumlahTotal", "remarks"]
        });
        return res.json({
            status: "Ok",
            data: data
        })
    } catch(error){
        res.status(500).json({
            status: 'error',
            data: error
        })
    }
}


module.exports = routes => {
    routes.get('/getAllPO', getAllPO.getAll); // Get Al
}