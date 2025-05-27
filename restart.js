module.exports = {
  name: 'restart',
  description: 'Startet den Bot neu (nur für Owner).',
  async execute(message, args, client) {
    if (message.author.id !== client.config.ownerId) {
      return message.reply('❌ Du hast keine Berechtigung, diesen Befehl zu benutzen.');
    }
    await message.reply('♻️ Bot wird neu gestartet...');
    console.log('Bot wird neu gestartet auf Befehl von', message.author.tag);
    process.exit(1); // exit code 1 oder 0 je nach deinem Prozessmanager
  },
};
