const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dirPath = req.query.path || './uploads';
      await fs.mkdir(dirPath, { recursive: true });
      cb(null, dirPath);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.query);
  next();
});

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

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, err => {
    if (err) {
      res.status(500).send({ error: err.message });
    }
  });
});

app.post('/api/upload', (req, res) => {
  console.log('Upload request received');
  console.log('Headers:', req.headers);
  console.log('Content-Length:', req.headers['content-length']);
  console.log('Content-Type:', req.headers['content-type']);
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      console.error('Multer error code:', err.code);
      return res.status(500).json({ error: err.message });
    }

    console.log('Multer processed request successfully');
    console.log('req.file exists:', !!req.file);
    console.log('req.file details:', req.file);
    console.log('req.body:', req.body);

    if (!req.file) {
      console.log('No file found after multer processing');
      console.log('This usually means:');
      console.log('1. Field name is not "file"');
      console.log('2. Postman field type is "Text" instead of "File"');
      console.log('3. No file was actually selected in Postman');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('SUCCESS: File saved at:', req.file.path);
    res.json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});