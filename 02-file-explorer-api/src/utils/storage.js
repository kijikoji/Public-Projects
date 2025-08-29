const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const baseUploads = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.user?.id;
      if (!userId) return cb(new Error('Unauthorized'));

      // optional subfolder path passed in body or query
      let relative = req.body?.path || req.query?.path || '';
      relative = relative.replace(/^\/+/, '');

      // full user folder path
      const userFolder = path.join(baseUploads, String(userId));
      const safePath = path.join(userFolder, relative);

      if (!safePath.startsWith(userFolder)) {
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
