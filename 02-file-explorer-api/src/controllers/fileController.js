const fs = require('fs').promises;
const path = require('path');

const baseUploads = path.join(__dirname, '../../uploads');

// helper to resolve safe user path
function getUserSafePath(req, relative = '') {
  const userId = req.user?.id;
  if (!userId) throw new Error('Unauthorized');

  relative = relative.replace(/^\/+/, '');

  const userFolder = path.join(baseUploads, String(userId));
  const fullPath = path.join(userFolder, relative);

  if (!fullPath.startsWith(userFolder)) {
    throw new Error('Invalid path');
  }

  return { userFolder, fullPath };
}

exports.listFiles = async (req, res, next) => {
  try {
    const { fullPath } = getUserSafePath(req, req.query.path || './');
    const files = await fs.readdir(fullPath);
    const result = await Promise.all(
      files.map(async name => {
        const filePath = path.join(fullPath, name);
        const stats = await fs.stat(filePath);
        return {
          name,
          type: stats.isDirectory() ? 'directory' : 'file',
          size: stats.size,
          modified: stats.mtime
        };
      })
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.downloadFile = (req, res, next) => {
  try {
    const { fullPath } = getUserSafePath(req, req.query?.path || '');
    const filePath = path.join(fullPath, req.params.filename);
    res.download(filePath, err => {
      if (err) next(err);
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({ success: true, data: req.file });
};

exports.deleteFile = async (req, res, next) => {
  try {
    if (!req.query.path) {
      return res
        .status(400)
        .json({ success: false, error: 'Path parameter is required' });
    }

    const { fullPath } = getUserSafePath(req, req.query.path);
    await fs.rm(fullPath, { recursive: true, force: true });

    res.json({ success: true, message: `${req.query.path} deleted successfully` });
  } catch (err) {
    next(err);
  }
};
