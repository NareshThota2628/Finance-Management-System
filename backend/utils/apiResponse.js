class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
    }
  
    static success(res, data, message = 'Success', statusCode = 200) {
      return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
    }
  
    static error(res, message = 'Error', statusCode = 500) {
      return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
    }
  
    static paginated(res, data, pagination, message = 'Success', statusCode = 200) {
      return res.status(statusCode).json({
        ...new ApiResponse(statusCode, data, message),
        pagination
      });
    }
  }
  
  module.exports = ApiResponse;