// responseMiddleware.js

function standardizeResponse(req, res, next) {
  res.apiSuccess = function(statusCode = 200, data, message = 'Success') {
    res.status(statusCode).json({
      status: statusCode,
      message: message,
      data: data,
    });
  };

  res.apiError = function(statusCode = 500, message = 'Internal Server Error') {
    res.status(statusCode).json({
      status: 'error',
      message: message,
    });
  };

  next();
}

module.exports = standardizeResponse;
