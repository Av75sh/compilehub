const multer = require('multer');

const errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
};

module.exports = { errorHandler, notFoundHandler };