const fs = require('fs');
const path = require('path');

const warnsPath = path.resolve(__dirname, '../warns.json');

function loadWarns() {
  if (!fs.existsSync(warnsPath)) {
    fs.writeFileSync(warnsPath, '{}');
  }
  const data = fs.readFileSync(warnsPath);
  return JSON.parse(data);
}

function saveWarns(warns) {
  fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));
}

function addWarn(guildId, userId, reason, moderator) {
  const warns = loadWarns();
  if (!warns[guildId]) warns[guildId] = {};
  if (!warns[guildId][userId]) warns[guildId][userId] = [];

  warns[guildId][userId].push({
    reason,
    moderator,
    date: new Date().toISOString(),
  });

  saveWarns(warns);
}

function getWarns(guildId, userId) {
  const warns = loadWarns();
  return (warns[guildId] && warns[guildId][userId]) || [];
}

module.exports = { addWarn, getWarns };
