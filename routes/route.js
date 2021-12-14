// const { route } = require('../app');
const getAllPO = require('../controllers/po/getAllPO');

module.exports = function(express){
    const route = express.Router();

    route.get("/getAllPO", getAllPO.getAll )
}


// module.exports = getAllPO;
module.exports = routes => {
    routes.get('/getAllPO', getAllPO.getAll); // Get Al
}
