const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bannt einen Benutzer vom Server.',
  async execute(client, message, args) {
    // Rechte-Check
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ content: '❌ Du hast keine Berechtigung, Mitglieder zu bannen.' });
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';

    if (!member) {
      return message.reply({ content: '❌ Bitte erwähne einen Benutzer, der gebannt werden soll.' });
    }

    if (!member.bannable) {
      return message.reply({ content: '❌ Ich kann diesen Benutzer nicht bannen.' });
    }

    try {
      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setTitle('🔨 Benutzer gebannt')
        .setDescription(`**${member.user.tag}** wurde erfolgreich gebannt.\n**Grund:** ${reason}`)
        .setColor(0xff0000)
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Ban-Fehler:', err);
      return message.reply({ content: '❌ Beim Bannen ist ein Fehler aufgetreten.' });
    }
  }
};
