const genericResponseMiddleware = (req, res, next) => {
    res.sendApiResponse = (data, message = "Success", statusCode = 200) => {
      res.status(statusCode).json({
        success: true,
        statusCode,
        data,
      });
    };
  
    res.sendApiError = (error, statusCode = 500) => {
      const defaultMessage = "Internal Server Error";
  
      if (typeof error === "string") {
        res.status(statusCode).json({
          success: false,
          message: error || defaultMessage,
        });
      } else if (error instanceof Error) {
        console.error(error.stack);
        res.status(statusCode).json({
          success: false,
          statusCode,
          message: error.message || defaultMessage,
        });
      } else {
        res.status(statusCode).json({
          success: false,
          message: defaultMessage,
        });
      }
    };
  
    next();
  };
  
  module.exports = genericResponseMiddleware;