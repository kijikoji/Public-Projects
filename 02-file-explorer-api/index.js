const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = req.body.path || './uploads';
    fs.mkdir(dirPath, { recursive: true })
      .then(() => cb(null, dirPath))
      .catch(err => cb(err)); 
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/list', async (req, res) => {
  const dirPath = req.query.path || './';

  try {
    const files = await fs.readdir(dirPath);
    const result = await Promise.all(files.map(async name => {
      const fullPath = path.join(dirPath, name);
      const stats = await fs.stat(fullPath);
      return {
        name,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        modified: stats.mtime,
        path: fullPath
      };
    }));

    res.json({ path: dirPath, contents: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('file saved at ', req.file.path);
  res.json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
