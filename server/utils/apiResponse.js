class ApiResponse {
  static success(res, data = {}, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = {}, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({ success: false, message });
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({ success: false, message });
  }

  static forbidden(res, message = 'Access forbidden') {
    return res.status(403).json({ success: false, message });
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

module.exports = ApiResponse;
