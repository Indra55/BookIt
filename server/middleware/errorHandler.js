const errorHandler = (err, req, res, next) => {
  console.error('=== ERROR DETAILS ===');
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('Body:', req.body);
  console.error('Error:', err.message || err);
  console.error('Stack:', err.stack);
  console.error('====================');
  
  const statusCode = err.statusCode || 500;
  
  // In production, don't expose error details
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({ 
      error: 'Something went wrong!',
      code: 'SERVER_ERROR'
    });
  }
  
  // In development, show detailed error information
  res.status(statusCode).json({
    error: err.message || 'An unknown error occurred',
    name: err.name,
    stack: err.stack,
    ...(err.code && { code: err.code })
  });
};

export default errorHandler;