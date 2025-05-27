const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed');
const { getWarns } = require('../../utils/warns');

module.exports = {
  name: 'warnlist',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const embed = createEmbed({
        title: '🚫 Keine Berechtigung',
        description: 'Du hast keine Berechtigung, Warnlisten anzusehen.',
        color: 0xffcc00,
      });
      return message.reply({ embeds: [embed] });
    }

    const userMention = message.mentions.users.first();
    if (!userMention) {
      const embed = createEmbed({
        title: '❌ Falsche Benutzung',
        description: 'Bitte erwähne den Benutzer, dessen Warnungen du sehen möchtest. Beispiel: `!warnlist @User`',
        color: 0xff6600,
      });
      return message.reply({ embeds: [embed] });
    }

    const warns = getWarns(message.guild.id, userMention.id);

    if (warns.length === 0) {
      const embed = createEmbed({
        title: 'ℹ️ Keine Warnungen',
        description: `${userMention.tag} hat keine Warnungen.`,
        color: 0x00cc66,
      });
      return message.reply({ embeds: [embed] });
    }

    // Warnungen formatieren
    let description = warns
      .map(
        (w, i) =>
          `**${i + 1}. Warnung**\nGrund: ${w.reason}\nModerator: ${w.moderator}\nDatum: <t:${Math.floor(
            new Date(w.date).getTime() / 1000
          )}:f>\n`
      )
      .join('\n');

    // Wenn zu lang, ggf. aufteilen oder kürzen (hier einfach cutten)
    if (description.length > 4096) {
      description = description.slice(0, 4000) + '\n... (mehr Warnungen)';
    }

    const embed = createEmbed({
      title: `⚠️ Warnungen von ${userMention.tag}`,
      description,
      color: 0xffcc00,
    });

    message.reply({ embeds: [embed] });
  },
};
