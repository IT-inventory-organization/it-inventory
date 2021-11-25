const { NotFoundException, ServerFault } = require("../../middlewares/errHandler");
const { getReportPerId } = require("./report")

const dashboard = async(id) => {
    try {
        const query = {
            where: {
                id: id,
                isDelete: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDelete']
            },
            include: [
                {
                    model: DataKapal,
                    attributes: {
                        exclude: [
                            'voyageKapal', 'namaKapal', 'benderaKapal',
                            'updatedAt', 'createdAt']
                    }
                },
                {
                    model: Report,
                    attributes: {
                        exclude: [
                            'jenisDokumenBC',
                            'updatedAt', 'createdAt'
                        ]
                    }
                }
            ]
        }
        const resultDashboard = await DataKapal.findOne(query);
        if(!resultDashboard){
            throw new NotFoundException("Data Tidak Ditemukan");
        }
        return resultDashboard.toJSON();
    } catch (error){
        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        }else{
            throw error
        }
    }
}

module.exports = {
    dashboard
}