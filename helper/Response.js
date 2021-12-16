const Encryption = require('./encription');

const errorResponse = (res, status, message, data) => {
  return res.status(status).json({
    success: false, 
    message,
    data: data || null
  })
}
/**
 * TODO: Create Encrypt Data 
 */
const successResponse = async (res, status, message, data, doEncrypt = true) => {
  let EncyptData = null; 
  if(data != null && doEncrypt){
    EncyptData = await Encryption.AESEncrypt(data);
  }
  return res.status(status).json({
    success: true, 
    message, 
    data: doEncrypt ? EncyptData : data
  })
}



module.exports = {
  errorResponse,
  successResponse
}