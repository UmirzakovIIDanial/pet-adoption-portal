// server/utils/errorResponse.js (завершение)
class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = ErrorResponse;
  
  // server/middleware/async.middleware.js (завершение)
  const asyncHandler = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports = asyncHandler;