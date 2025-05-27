const { getStats } = require('../../utils/modStats');

module.exports = {
  name: 'modstats',
  description: 'Zeigt deine Moderationsstatistik',
  async execute(client, message, args) {
    const stats = getStats(message.author.id);
    const embed = {
      color: 0x3498db,
      title: '📊 Deine Mod-Statistik',
      description: `Hier sind deine Aktionen:`,
      fields: [
        { name: '👢 Kicks', value: `${stats.kicks}`, inline: true },
        { name: '🔨 Bans', value: `${stats.bans}`, inline: true },
        { name: '⚠️ Warns', value: `${stats.warns}`, inline: true }
      ],
      timestamp: new Date()
    };
    message.reply({ embeds: [embed] });
  }
};
