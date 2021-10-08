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
const successResponse = async (res, status, message, data) => {
  let EncyptData = null; 
  if(data != null){
    EncyptData = await Encryption.AESEncrypt(data);
  }
  return res.status(status).json({
    success: true, 
    message, 
    data: EncyptData
  })
}



module.exports = {
  errorResponse,
  successResponse
}