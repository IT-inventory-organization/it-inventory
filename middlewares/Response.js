const errorResponse = (res, status, message) => {
  return res.status(status).json({
    success: false, 
    message,
    data: null
  })
}

const successResponse = (res, status, payload) => {
  return res.status(status).json(payload)
}

module.exports = {
  errorResponse,
  successResponse
}