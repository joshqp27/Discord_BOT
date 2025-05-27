const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'botinfo',
  description: 'Zeigt Informationen über den Bot an',
  execute(message, args, client) {
    const uptimeSeconds = Math.floor(client.uptime / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Info')
      .setColor('#0099ff')
      .addFields(
        { name: 'Botname', value: client.user.tag, inline: true },
        { name: 'Bot ID', value: client.user.id, inline: true },
        { name: 'Uptime', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
        { name: 'Server', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Benutzer', value: `${client.users.cache.size}`, inline: true },
        { name: 'Node.js Version', value: process.version, inline: true },
        { name: 'discord.js Version', value: require('discord.js').version, inline: true }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
