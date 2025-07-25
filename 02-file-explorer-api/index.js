const express = require('express');
const fs = require('fs').promises;
const path = require('path');

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
