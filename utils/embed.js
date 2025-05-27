const { EmbedBuilder } = require('discord.js');

function createEmbed({ title, description, color = 0x2f3136 }) {
  return new EmbedBuilder()
    .setTitle(title || '')
    .setDescription(description || '')
    .setColor(color)
;
}

module.exports = { createEmbed };
