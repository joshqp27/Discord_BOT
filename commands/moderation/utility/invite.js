const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'invite',
  description: 'Zeigt, wie viele Mitglieder ein Benutzer eingeladen hat.',
  async execute(message, args, client) {
    try {
      // Zielnutzer: Erwähnung, ID oder Standard = Autor
      let target = message.mentions.users.first()
        || client.users.cache.get(args[0])
        || message.author;

      const invites = await message.guild.invites.fetch();
      const userInvites = invites.filter(inv => inv.inviter && inv.inviter.id === target.id);
      const totalUses = userInvites.reduce((acc, invite) => acc + (invite.uses || 0), 0);

      const embed = new EmbedBuilder()
        .setTitle('📨 Einladungen')
        .setDescription(`${target} hat insgesamt **${totalUses}** Mitglieder eingeladen.`)
        .setColor(0x00ff99)
        ;

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('Fehler beim Abrufen der Einladungen:', err);
      message.reply('❌ Es ist ein Fehler beim Abrufen der Einladungen aufgetreten.');
    }
  }
};
