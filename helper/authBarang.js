const User = require('../database/models/user');

const authUser = async(model, id, req, extraCondition = false) => {
  let result;

  const query = {
    where: {id}
  }

  if(extraCondition) {
    query.include = [User]
  }

  try {
    result = await model.findOne(query);
    if(result == null){
      return false
    }else{
      return true;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
    authUser
}