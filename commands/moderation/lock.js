const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Sperrt den aktuellen Kanal für @everyone mit Begründung.',
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ Du hast keine Berechtigung, diesen Befehl zu nutzen.');
    }

    const reason = args.join(' ');
    if (!reason) {
      return message.reply('❗ Bitte gib eine Begründung für das Sperren an.');
    }

    const channel = message.channel;

    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('🔒 Kanal gesperrt')
      .setDescription(`Der Kanal ${channel} wurde für @everyone gesperrt.\n**Grund:** ${reason}`)
      .setTimestamp();

    await message.channel.send({ content: '@everyone', embeds: [embed] });
  }
};
