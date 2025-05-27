const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: '📋 Zeigt Informationen über einen Benutzer an.',
  async execute(message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    if (!member) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Benutzer nicht gefunden.')
        .setColor(0xff0000);
      return message.reply({ embeds: [embed] });
    }

    const user = member.user;

    const embed = new EmbedBuilder()
      .setTitle(`👤 Benutzerinfo: ${user.tag}`)
      .setColor(0x3498db)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 Benutzer-ID', value: user.id, inline: true },
        { name: '📅 Erstellt am', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '📥 Beigetreten am', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
        {
          name: '🎭 Rollen',
          value: member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => `<@&${r.id}>`)
            .join(', ') || 'Keine',
        },
        { name: '🤖 Bot?', value: user.bot ? 'Ja' : 'Nein', inline: true }
      )
      .setFooter({ text: `Angefordert von ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
