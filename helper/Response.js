const errorResponse = (res, status, message, data) => {
  return res.status(status).json({
    success: false, 
    message,
    data: data || null
  })
}

const successResponse = (res, status, message, data) => {
  return res.status(status).json({
    succes: true, message, data:data || null
  })
}



module.exports = {
  errorResponse,
  successResponse
}