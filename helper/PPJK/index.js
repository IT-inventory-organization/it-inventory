const reportIdentitasPPJK = require('../../database/models/identitasppjk');
const authorization = require('../authorization');

module.exports = {
    createPPJK: async (data, tranaction = null, returning = null) => {
        try {
            
            const result = await reportIdentitasPPJK.create(data, {
                tranaction,
                returning
            });
            console.log(data);
            return result;
        } catch (error) {
            console.log(error)
            throw Error(error.message)
        }
    },
    updatePPJK: async (data, idReport, transaction = null, returning = null) => {
        try {
            if(! await authorization(reportIdentitasPPJK, idReport, req, true)){
                return {
                    error: `User Not Allowed`
                }
            }
            const found = await reportIdentitasPPJK.findOne({
                where: {
                    id: data.id,
                    reportId: idReport
                }
            });
            if(!found){
                return {
                    error: `Data Not Found`
                }
            }

            const update = await reportIdentitasPPJK.update(data, {
                where: {
                    id: data.id,
                    reportId: idReport
                },
                transaction,
                returning
            })
            return update;
        } catch (error) {
            throw Error('Failed To Update')
        }
    }
}