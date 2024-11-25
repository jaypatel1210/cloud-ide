const path = require('path');

const config = {
  ALLOWED_ORIGINS: 'https://cloud-ide.jaypatel.digital',
  WORKSPACE_PATH: '/wsdata', // path.resolve(__dirname, 'workspace'), // use In Local development
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
};

module.exports = config;
