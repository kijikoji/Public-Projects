const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Setup test environment
const testDbPath = path.join(__dirname, '../test-database.sqlite');

beforeAll(() => {
  // Create test database
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_PATH = testDbPath;
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(() => {
  // Clean up test database
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

module.exports = {
  testDbPath
};
