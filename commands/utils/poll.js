const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'poll',
  description: 'Erstellt eine einfache Umfrage.',
  async execute(message, args) {
    const question = args.join(' ');
    if (!question) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Bitte gib eine Frage für die Umfrage ein.')
        .setColor('Red')
      ]});
    }

    const embed = new EmbedBuilder()
      .setTitle('📊 Umfrage')
      .setDescription(question)
      .setColor('Yellow')
      .setFooter({ text: `Umfrage von ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    try {
      const pollMessage = await message.channel.send({ embeds: [embed] });
      await pollMessage.react('👍');
      await pollMessage.react('👎');
      await message.delete();
    } catch (error) {
      console.error(error);
      return message.reply({ embeds: [new EmbedBuilder()
        .setTitle('❌ Fehler')
        .setDescription('Konnte die Umfrage nicht erstellen.')
        .setColor('Red')
      ]});
    }
  },
};
