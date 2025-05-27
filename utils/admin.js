const config = require('../config.json');

function isAdmin(userId) {
  return config.adminWhitelist.includes(userId);
}

module.exports = { isAdmin };
