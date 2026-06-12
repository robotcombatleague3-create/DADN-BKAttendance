const errorHandler = (err, req, res, next) => {
  console.error('[Global Error Handler]:', err);

  const statusCode = err.statusCode || 500;
  // Don't expose internal server error details to client unless it's a known error
  const message = err.message || 'Lỗi hệ thống nội bộ';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
