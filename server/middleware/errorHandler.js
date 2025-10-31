// Global unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('===========================');
});

// Global uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('=== UNCAUGHT EXCEPTION ===');
  console.error(error);
  console.error('==========================');
  process.exit(1); // Exit with failure
});

const errorHandler = (err, req, res, next) => {
  // Log all error details
  console.error('=== ERROR HANDLER ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('Headers:', req.headers);
  console.error('Query:', req.query);
  console.error('Body:', req.body);
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message || 'No error message');
  console.error('Error Stack:', err.stack || 'No stack trace');
  console.error('Error Code:', err.code || 'N/A');
  console.error('Error Status:', err.status || 'N/A');
  console.error('====================');
  
  const statusCode = err.statusCode || 500;
  
  // Always include error code in response
  const response = {
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: err.details || null,
      name: err.name
    })
  };
  
  res.status(statusCode).json(response);
};

export default errorHandler;