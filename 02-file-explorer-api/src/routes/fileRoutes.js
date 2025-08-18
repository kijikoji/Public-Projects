const express = require('express');
const multer = require('multer');
const { uploadFile, listFiles, downloadFile, deleteFile } = require('../controllers/fileController');
const storage = require('../utils/storage');

const router = express.Router();
const upload = multer({ storage });

// GET /api/files?path=...
router.get('/', listFiles);

// GET /api/files/:filename
router.get('/:filename', downloadFile);

// POST /api/files
router.post('/', upload.single('file'), uploadFile);

// DELETE /api/files?path=...
router.delete('/', deleteFile);

module.exports = router;
