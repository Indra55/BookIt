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
  // Safely handle undefined/null errors
  if (!err) {
    console.error('=== UNKNOWN ERROR ===');
    console.error('An unknown error occurred, but no error object was provided');
    console.error('Request URL:', req?.originalUrl || 'N/A');
    console.error('Request Method:', req?.method || 'N/A');
    console.error('Timestamp:', new Date().toISOString());
    console.error('====================');
    
    return res.status(500).json({
      error: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR'
    });
  }

  // Log all error details
  console.error('=== ERROR HANDLER ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('URL:', req?.originalUrl || 'N/A');
  console.error('Method:', req?.method || 'N/A');
  console.error('Headers:', req?.headers || 'N/A');
  console.error('Query:', req?.query || 'N/A');
  console.error('Body:', req?.body || 'N/A');
  console.error('Error Name:', err.name || 'N/A');
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