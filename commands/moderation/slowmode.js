const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'slowmode',
  description: 'Aktiviert Slowmode im Channel (Sekunden).',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Keine Berechtigung')
        .setDescription('Du brauchst die Berechtigung "Kanäle verwalten", um diesen Befehl zu nutzen.')
        .setColor('Red')
      ]});
    }

    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Ungültige Eingabe')
        .setDescription('Bitte gib eine Zahl zwischen 0 und 21600 (6 Stunden) an.')
        .setColor('Red')
      ]});
    }

    try {
      await message.channel.setRateLimitPerUser(seconds);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('✅ Slowmode gesetzt')
        .setDescription(`Slowmode im Channel ist jetzt auf \`${seconds}\` Sekunden.`)
        .setColor('Green')
      ]});
    } catch (error) {
      console.error(error);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Konnte Slowmode nicht setzen.')
        .setColor('Red')
      ]});
    }
  },
};
