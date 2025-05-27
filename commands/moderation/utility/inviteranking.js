const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'inviteranking',
  description: 'Zeigt das Leaderboard der Mitglieder mit den meisten Einladungen.',
  async execute(message) {
    try {
      const invites = await message.guild.invites.fetch();
      const inviteCounts = {};

      for (const invite of invites.values()) {
        if (!invite.inviter) continue;

        const id = invite.inviter.id;
        inviteCounts[id] = (inviteCounts[id] || 0) + (invite.uses || 0);
      }

      const sorted = Object.entries(inviteCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10

      if (sorted.length === 0) {
        return message.reply('❌ Es wurden keine gültigen Einladungen gefunden.');
      }

      const leaderboard = await Promise.all(
        sorted.map(async ([userId, count], index) => {
          const user = await message.client.users.fetch(userId).catch(() => null);
          const name = user ? user.tag : `Unbekannt (${userId})`;
          return `\`${index + 1}.\` **${name}** – \`${count}\` Einladungen`;
        })
      );

      const embed = new EmbedBuilder()
        .setTitle('🏆 Invite Leaderboard')
        .setDescription(leaderboard.join('\n'))
        .setColor(0x00bfff)
        .setTimestamp();

      message.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Fehler beim Erstellen des Invite-Leaderboards:', error);
      message.reply('❌ Beim Abrufen des Invite-Leaderboards ist ein Fehler aufgetreten.');
    }
  }
};
