const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function getFileExtension(language) {
  const extensions = {
    'C': '.c',
    'C++': '.cpp',
    'Java': '.java',
    'Python': '.py'
  };
  return extensions[language] || '.txt';
}

const uploadsDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4();
    const extension = getFileExtension(req.body.language);
    cb(null, `${uniqueName}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error('Only text files are allowed!'), false);
    }
  }
});

module.exports = { upload, uploadsDir, getFileExtension };
