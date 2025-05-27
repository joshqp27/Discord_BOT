const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'check',
  description: 'Überprüft alle geladenen Befehle auf Fehler.',
  async execute(message, args, client) {
    const results = [];

    for (const [name, command] of client.commands) {
      try {
        // Prüfen, ob `name` und `execute` vorhanden sind
        if (!command.name || typeof command.execute !== 'function') {
          results.push(`❌ \`${name}\`: Ungültiger Befehl (kein "execute")`);
        } else {
          results.push(`✅ \`${name}\`: OK`);
        }
      } catch (error) {
        console.error(`Fehler beim Überprüfen von ${name}:`, error);
        results.push(`❌ \`${name}\`: Fehler – ${error.message}`);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('🔍 Befehlsprüfung')
      .setDescription(results.join('\n').slice(0, 4000) || 'Keine Befehle gefunden.')
      .setColor(0x00ffcc)
      .setFooter({ text: `Insgesamt geprüft: ${client.commands.size}` })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};
