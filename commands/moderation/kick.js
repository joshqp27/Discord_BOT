const { incrementAction } = require('../../utils/modStats');

module.exports = {
  name: 'kick',
  description: 'Kickt einen Benutzer vom Server',
  async execute(client, message, args) {
    if (!message.member.permissions.has('KickMembers')) {
      return message.reply({
        embeds: [{
          color: 0xffcc00,
          title: '🚫 Keine Berechtigung',
          description: 'Du darfst keine Mitglieder kicken.'
        }]
      });
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';

    if (!member) {
      return message.reply({
        embeds: [{
          color: 0xffcc00,
          title: '❌ Fehler',
          description: 'Bitte erwähne einen Benutzer zum Kicken.'
        }]
      });
    }

    try {
      await member.kick(reason);
      incrementAction(message.author.id, 'kicks'); // ✅ Logging nach erfolgreichem Kick

      const embed = {
        color: 0xff9900,
        title: '👢 Benutzer gekickt',
        description: `${member.user.tag} wurde gekickt.\nGrund: ${reason}`,
        footer: { text: `Von: ${message.author.tag}` },
        timestamp: new Date()
      };

      message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      message.reply({
        embeds: [{
          color: 0xff0000,
          title: '⚠️ Fehler',
          description: 'Der Benutzer konnte nicht gekickt werden.'
        }]
      });
    }
  }
};
