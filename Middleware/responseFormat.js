const apiResponseMiddleware = (req, res, next) => {
    const successResponse = (data) => ({
      success: true,
      message: 'Request processed successfully',
      data: data || null
    });
  
    // Error response object
    const errorResponse = (message, statusCode = 500) => ({
      success: false,
      message: message || 'Internal Server Error',
      statusCode
    });
  
    res.locals.successResponse = successResponse;
    res.locals.errorResponse = errorResponse;
  
    res.sendSuccess = (data) => res.json(successResponse(data));
  
    res.sendError = (message, statusCode) => res.status(statusCode || 500).json(errorResponse(message, statusCode));
  
    next();
  };
  
  module.exports = apiResponseMiddleware;
  