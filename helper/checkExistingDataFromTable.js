module.exports = {
    /**
     * Check if Data inside Database Is Exists
     * Using Model
     * @param {Model} model 
     * @param {{}} query 
     */
    isExist: async (model, query) => {
        if(typeof query === 'undefined' || Object.keys(query) === 0){
            throw new Error(`Something's went wrong`);
        }
        const existed = await model.findOne(query);
        if(!existed){
            throw Error(`Data Not Found`);
        }
    }
    
}