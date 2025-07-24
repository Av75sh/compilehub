const fs = require('fs');
const path = require('path');
const { uploadsDir } = require('../config/multer');

const startCleanupService = () => {
  setInterval(() => {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; 

    fs.readdir(uploadsDir, (err, files) => {
      if (err) return;

      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;

          if (now - stats.mtime.getTime() > maxAge) {
            fs.unlink(filePath, (err) => {
              if (err) console.error('Error deleting old file:', err);
            });
          }
        });
      });
    });
  }, 5 * 60 * 1000); 
};

module.exports = { startCleanupService };