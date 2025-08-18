const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const baseUploads = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let relative = req.body?.path || req.query?.path || '';
      relative = relative.replace(/^\/+/, '');

      const safePath = path.join(baseUploads, relative);

      if (!safePath.startsWith(baseUploads)) {
        return cb(new Error('Invalid path'));
      }

      await fs.mkdir(safePath, { recursive: true });
      cb(null, safePath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

module.exports = storage;
