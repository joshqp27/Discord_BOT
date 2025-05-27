const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unlock',
  description: 'Entsperrt den aktuellen Kanal für @everyone mit optionaler Begründung.',
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ Du hast keine Berechtigung, diesen Befehl zu nutzen.');
    }

    const reason = args.join(' '); // kann leer sein
    const channel = message.channel;

    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: true,
    });

    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('🔓 Kanal entsperrt');

    if (reason) {
      embed.setDescription(`Der Kanal ${channel} wurde wieder für @everyone freigegeben.\n**Grund:** ${reason}`);
    } else {
      embed.setDescription(`Der Kanal ${channel} wurde wieder für @everyone freigegeben.`);
    }

    embed.setTimestamp();

    await message.channel.send({ content: '@everyone', embeds: [embed] });
  }
};
