const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'clearall',
  description: '🧹 Löscht alle Nachrichten im aktuellen Channel.',
  async execute(message) {
    // Rechte prüfen
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed = createEmbed({
        title: '🚫 Keine Berechtigung',
        description: 'Du benötigst die Berechtigung **Nachrichten verwalten**, um diesen Befehl zu nutzen.',
        color: 0xff0000,
      });
      return message.reply({ embeds: [embed], ephemeral: true });
    }

    if (!message.guild || !message.channel) return;

    try {
      const embedStart = createEmbed({
        title: '🧹 Nachrichten werden gelöscht...',
        description: `Alle Nachrichten in <#${message.channel.id}> werden entfernt.`,
        color: 0xffcc00,
      });
      await message.reply({ embeds: [embedStart] });

      // Channel klonen, um alles zu löschen
      const cloned = await message.channel.clone();
      await message.channel.delete();

      const doneEmbed = createEmbed({
        title: '✅ Channel gelöscht & neu erstellt',
        description: `Alle Nachrichten wurden entfernt.`,
        color: 0x00ff99,
      });
      await cloned.send({ embeds: [doneEmbed] });

    } catch (error) {
      console.error('❌ Fehler bei clearall:', error);
      const errorEmbed = createEmbed({
        title: '❌ Fehler',
        description: 'Es ist ein Fehler beim Löschen des Channels aufgetreten.',
        color: 0xff0000,
      });
      message.reply({ embeds: [errorEmbed] });
    }
  },
};
