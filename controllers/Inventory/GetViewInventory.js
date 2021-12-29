const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllInventory } = require('../../helper/Repository/Inventory');
const httpStatus = require('../../helper/Httplib');

const getViewInventory = async (req, res) => {
    try {
        
        const inventory = await getAllInventory(req, req.currentUser);
        
        for (const key in inventory) {
            if (Object.hasOwnProperty.call(inventory, key)) {
                const element = inventory[key].toJSON();
                if(element?.dokumenPemasukan?.dokumenPengeluaran){
                    delete inventory[key];
                }
            }
        }

        return successResponse(res, httpStatus.ok, "", inventory.flat(), false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, httpStatus.internalServerError, "Gagal Mengambil Data", []);
    }
}

module.exports = routes => {
    routes.get('/', authentication ,getViewInventory)
}