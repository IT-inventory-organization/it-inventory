const reportIdentitasPPJK = require('../../database/models/identitasppjk');
const authorization = require('../authorization');
const { isExist } = require('../checkExistingDataFromTable');

module.exports = {
    /**
     * Success
     * @param {*} data 
     * @param {*} tranaction 
     * @param {*} returning 
     * @returns 
     */
    createPPJK: async (data, tranaction = null) => {
        try {
            
            const result = await reportIdentitasPPJK.create(data, {
                tranaction,
                returning: true
            });
            
            return result;
        } catch (error) {
            throw Error(error.message)
        }
    },
    updatePPJK: async (data, idReport, returning = null, transaction = null) => {
        try {
            const query = {
                where: {
                    id: data.id,
                    reportId: idReport
                }
            }
            await isExist(reportIdentitasPPJK, query)

            const update = await reportIdentitasPPJK.update(data, {
                ...query,
                transaction,
                returning
            })
            return update;
        } catch (error) {

            throw Error('Failed To Update')
        }
    }
}