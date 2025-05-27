module.exports = {
  name: 'shutdown',
  description: 'Fährt den Bot herunter (nur für Owner).',
  async execute(message, args, client) {
    if (message.author.id !== client.config.ownerId) {
      return message.reply('❌ Du hast keine Berechtigung, diesen Befehl zu benutzen.');
    }
    await message.reply('🔌 Bot wird heruntergefahren...');
    console.log('Bot wird heruntergefahren auf Befehl von', message.author.tag);
    process.exit(0);
  },
};
