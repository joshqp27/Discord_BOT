module.exports = {
  name: 'role',
  description: 'Fügt eine Rolle hinzu oder entfernt sie, je nachdem ob der User sie hat',

  async execute(message, args, client) {
    // Prüfen, ob eine Rolle angegeben wurde
    if (!args.length) {
      return message.reply('Bitte gib den Namen der Rolle an, die du hinzufügen oder entfernen möchtest.');
    }

    const roleName = args.join(' ');
    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

    if (!role) {
      return message.reply(`Die Rolle "${roleName}" wurde nicht gefunden.`);
    }

    const member = message.member;

    if (member.roles.cache.has(role.id)) {
      // Rolle entfernen
      try {
        await member.roles.remove(role);
        return message.reply(`Die Rolle **${role.name}** wurde dir entfernt.`);
      } catch (error) {
        console.error(error);
        return message.reply('Beim Entfernen der Rolle ist ein Fehler aufgetreten.');
      }
    } else {
      // Rolle hinzufügen
      try {
        await member.roles.add(role);
        return message.reply(`Die Rolle **${role.name}** wurde dir hinzugefügt.`);
      } catch (error) {
        console.error(error);
        return message.reply('Beim Hinzufügen der Rolle ist ein Fehler aufgetreten.');
      }
    }
  },
};
