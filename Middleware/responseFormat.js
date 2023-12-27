const apiResponseMiddleware = (req, res, next) => {
    const successResponse = (data, statusCode = 200) => ({
      status: "success",
      message: 'Request processed successfully',
      data: {
        message: data.message || null,
        statusCode,
        ...data
      }
    });
  
    // Error response object
    const errorResponse = (message, statusCode = 500) => ({
      success: false,
      message: message || 'Internal Server Error',
      statusCode
    });
  
    res.locals.successResponse = successResponse;
    res.locals.errorResponse = errorResponse;
  
    res.sendSuccess = (data, statusCode) => res.status(statusCode || 200).json(successResponse(data, statusCode));
  
    res.sendError = (message, statusCode) => res.status(statusCode || 500).json(errorResponse(message, statusCode));
  
    next();
};

module.exports = apiResponseMiddleware;
