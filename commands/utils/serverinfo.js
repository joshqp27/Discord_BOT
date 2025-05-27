const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: '🛡️ Zeigt Informationen über diesen Server.',
  async execute(message) {
    const { guild } = message;

    const embed = new EmbedBuilder()
      .setTitle(`🛡️ Serverinfo: ${guild.name}`)
      .setColor(0x2ecc71)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '📛 Servername', value: guild.name, inline: true },
        { name: '🆔 Server-ID', value: guild.id, inline: true },
        { name: '👑 Eigentümer', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Erstellt am', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '👥 Mitglieder', value: `${guild.memberCount}`, inline: true },
        { name: '📜 Kanäle', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🌍 Region', value: guild.preferredLocale || 'Unbekannt', inline: true }
      )
      .setFooter({ text: `Angefordert von ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
