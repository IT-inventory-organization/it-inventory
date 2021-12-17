const { NotFoundException, ServerFault } = require("../middlewares/errHandler");

module.exports = {
    /**
     * Check if Data inside Database Is Exists
     * Using Model
     * @param {Model} model 
     * @param {{}} query 
     */
    isExist: async (model, query) => {
        if(Object.keys(query).length === 0){
            throw new ServerFault('Terjadi Kesalahan Pada Server')
        }
        const existed = await model.findOne(query);
        // console.log(existed.toJSON())
        if(!existed){
            throw new NotFoundException("Data Tidak Ada")
        }
    },
    
}