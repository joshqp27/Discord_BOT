const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'announce',
  description: 'Sendet eine Ankündigung mit Embed.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Keine Berechtigung')
        .setDescription('Du brauchst die Berechtigung "Nachrichten verwalten", um diesen Befehl zu nutzen.')
        .setColor('Red')
      ]});
    }

    const announcement = args.join(' ');
    if (!announcement) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Bitte gib den Text für die Ankündigung ein.')
        .setColor('Red')
      ]});
    }

    const embed = new EmbedBuilder()
      .setTitle('📢 Ankündigung')
      .setDescription(announcement)
      .setColor('Blue')
      .setTimestamp()
      .setFooter({ text: `Angekündigt von ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    try {
      await message.channel.send({ embeds: [embed] });
      await message.delete();
    } catch (error) {
      console.error(error);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Konnte die Ankündigung nicht senden.')
        .setColor('Red')
      ]});
    }
  },
};
