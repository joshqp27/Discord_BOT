const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'say',
  description: 'Lässt den Bot eine Nachricht senden.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Keine Berechtigung')
        .setDescription('Du brauchst die Berechtigung "Nachrichten verwalten", um diesen Befehl zu nutzen.')
        .setColor('Red')
      ]});
    }

    const text = args.join(' ');
    if (!text) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Bitte gib eine Nachricht ein, die der Bot senden soll.')
        .setColor('Red')
      ]});
    }

    try {
      await message.channel.send(text);
      await message.delete();
    } catch (error) {
      console.error(error);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Konnte die Nachricht nicht senden.')
        .setColor('Red')
      ]});
    }
  },
};
