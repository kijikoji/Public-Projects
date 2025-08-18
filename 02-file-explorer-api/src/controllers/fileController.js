const fs = require('fs').promises;
const path = require('path');
const baseUploads = path.join(__dirname, '../../uploads');

exports.listFiles = async (req, res, next) => {
  try {
    const dirPath = path.join(baseUploads, req.query.path || './');
    const files = await fs.readdir(dirPath);
    const result = await Promise.all(files.map(async name => {
      const fullPath = path.join(dirPath, name);
      const stats = await fs.stat(fullPath);
      return {
        name,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        modified: stats.mtime
      };
    }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.downloadFile = (req, res, next) => {
  const filePath = path.join(baseUploads, req.params.filename);
  res.download(filePath, err => {
    if (err) next(err);
  });
};

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({ success: true, data: req.file });
};

exports.deleteFile = async (req, res, next) => {
  try {
    const relativePath = req.query.path;
    if (!relativePath) {
      return res.status(400).json({ success: false, error: 'Path parameter is required' });
    }

    const filePath = path.join(baseUploads, relativePath);
    await fs.rm(filePath, { recursive: true, force: true });

    res.json({ success: true, message: `${relativePath} deleted successfully` });
  } catch (err) {
    next(err);
  }
};
