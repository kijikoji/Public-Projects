const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDir();
  }

  async ensureLogDir() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create log directory:', err);
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  async writeToFile(filename, message) {
    try {
      const logFile = path.join(this.logDir, filename);
      await fs.appendFile(logFile, message + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  info(message, meta = {}) {
    const formatted = this.formatMessage('info', message, meta);
    console.log(formatted);
    this.writeToFile('app.log', formatted);
  }

  error(message, meta = {}) {
    const formatted = this.formatMessage('error', message, meta);
    console.error(formatted);
    this.writeToFile('error.log', formatted);
  }

  warn(message, meta = {}) {
    const formatted = this.formatMessage('warn', message, meta);
    console.warn(formatted);
    this.writeToFile('app.log', formatted);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, meta);
      console.log(formatted);
    }
  }
}

module.exports = new Logger();
