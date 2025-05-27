const fs = require('fs');
const path = './data/modStats.json';

function loadStats() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function saveStats(stats) {
  fs.writeFileSync(path, JSON.stringify(stats, null, 2));
}

function incrementAction(modId, action) {
  const stats = loadStats();
  if (!stats[modId]) stats[modId] = { kicks: 0, bans: 0, warns: 0 };
  stats[modId][action]++;
  saveStats(stats);
}

function getStats(modId) {
  const stats = loadStats();
  return stats[modId] || { kicks: 0, bans: 0, warns: 0 };
}

module.exports = { incrementAction, getStats };
