const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'nick',
  description: 'Ändert den Nickname eines Users.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Keine Berechtigung')
        .setDescription('Du brauchst die Berechtigung "Nicknames verwalten", um diesen Befehl zu nutzen.')
        .setColor('Red')
      ]});
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Bitte erwähne einen Benutzer.')
        .setColor('Red')
      ]});
    }

    if (!member.manageable) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Ich kann den Nickname dieses Benutzers nicht ändern.')
        .setColor('Red')
      ]});
    }

    const newNick = args.slice(1).join(' ');
    if (!newNick) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Bitte gib einen neuen Nicknamen an.')
        .setColor('Red')
      ]});
    }

    try {
      await member.setNickname(newNick);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('✅ Nickname geändert')
        .setDescription(`Der Nickname von ${member.user.tag} wurde zu **${newNick}** geändert.`)
        .setColor('Green')
      ]});
    } catch (error) {
      console.error(error);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Konnte den Nickname nicht ändern.')
        .setColor('Red')
      ]});
    }
  },
};
