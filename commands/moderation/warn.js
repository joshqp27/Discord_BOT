const fs = require('fs');
const { incrementAction } = require('../../utils/modStats');

module.exports = {
  name: 'warn',
  description: 'Verwarnt einen User',
  async execute(client, message, args) {
    if (!message.member.permissions.has('KickMembers')) return;

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
    if (!member) return message.reply('Bitte markiere einen Benutzer');

    const warns = JSON.parse(fs.readFileSync('./data/warns.json', 'utf8'));
    if (!warns[member.id]) warns[member.id] = [];
    warns[member.id].push({ reason, date: new Date(), mod: message.author.id });

    fs.writeFileSync('./data/warns.json', JSON.stringify(warns, null, 2));
    incrementAction(message.author.id, 'warns');

    const embed = {
      color: 0xff9900,
      title: '⚠️ Verwarnung',
      description: `${member} wurde verwarnt.\nGrund: ${reason}`,
      timestamp: new Date()
    };
    message.channel.send({ embeds: [embed] });

    // AUTO-MUTE ODER KICK
    if (warns[member.id].length >= 3) {
      const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
      if (muteRole) {
        await member.roles.add(muteRole);
        message.channel.send({
          embeds: [{
            color: 0xff0000,
            title: '🔇 Automute',
            description: `${member} hat 3 Verwarnungen erhalten und wurde automatisch gemutet.`
          }]
        });
      }
    }
  }
};
