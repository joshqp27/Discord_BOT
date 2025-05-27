require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const http = require('http');

// 🛠️ Konfiguration
const prefix = process.env.PREFIX || '!';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.commands = new Collection();

// 🧩 Befehle direkt registrieren
client.commands.set('ping', {
  name: 'ping',
  description: 'Antwortet mit Pong!',
  async execute(client, message, args) {
    await message.reply('🏓 Pong!');
  },
});

client.commands.set('ban', {
  name: 'ban',
  description: 'Bannt einen Benutzer vom Server.',
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('❌ Du hast keine Berechtigung zum Bannen.');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ Bitte erwähne einen Benutzer.');
    if (!member.bannable) return message.reply('❌ Ich kann diesen Benutzer nicht bannen.');

    const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
    await member.ban({ reason });
    message.channel.send(`✅ ${member.user.tag} wurde gebannt. Grund: ${reason}`);
  }
});

client.commands.set('kick', {
  name: 'kick',
  description: 'Kickt einen Benutzer vom Server.',
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('❌ Du darfst niemanden kicken.');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ Bitte erwähne einen Benutzer.');
    if (!member.kickable) return message.reply('❌ Ich kann diesen Benutzer nicht kicken.');

    const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
    await member.kick(reason);
    message.channel.send(`✅ ${member.user.tag} wurde gekickt. Grund: ${reason}`);
  }
});

client.commands.set('clearall', {
  name: 'clearall',
  description: 'Löscht alle Nachrichten im Kanal.',
  async execute(client, message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('❌ Keine Berechtigung zum Löschen.');
    }

    const fetched = await message.channel.messages.fetch({ limit: 100 });
    message.channel.bulkDelete(fetched, true).then(() => {
      message.channel.send('✅ Nachrichten gelöscht.').then(msg => setTimeout(() => msg.delete(), 3000));
    });
  }
});

client.commands.set('lock', {
  name: 'lock',
  description: 'Sperrt den Kanal für alle Benutzer.',
  async execute(client, message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ Du darfst den Kanal nicht sperren.');
    }

    await message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
      SendMessages: false
    });
    message.channel.send('🔒 Kanal gesperrt.');
  }
});

client.commands.set('poll', {
  name: 'poll',
  description: 'Erstellt eine Umfrage.',
  async execute(client, message, args) {
    const question = args.join(' ');
    if (!question) return message.reply('❓ Bitte gib eine Frage an.');

    const pollEmbed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle('📊 Umfrage')
      .setDescription(question)
      .setFooter({ text: `Gestellt von ${message.author.tag}` })
      .setTimestamp();

    const pollMsg = await message.channel.send({ embeds: [pollEmbed] });
    await pollMsg.react('👍');
    await pollMsg.react('👎');
  }
});

client.commands.set('say', {
  name: 'say',
  description: 'Sendet eine Nachricht als Bot.',
  async execute(client, message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❌ Gib einen Text ein.');
    message.delete().catch(() => {});
    message.channel.send(text);
  }
});

client.commands.set('embed', {
  name: 'embed',
  description: 'Sendet eine eingebettete Nachricht.',
  async execute(client, message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❌ Gib einen Text ein.');

    const embed = new EmbedBuilder()
      .setTitle('📢 Nachricht')
      .setDescription(text)
      .setColor(0x3498db);

    message.channel.send({ embeds: [embed] });
  }
});

client.commands.set('ticket', {
  name: 'ticket',
  description: 'Erstellt ein Ticket (privater Channel).',
  async execute(client, message) {
    const category = message.guild.channels.cache.find(c => c.name === 'tickets' && c.type === ChannelType.GuildCategory);

    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText,
      parent: category?.id,
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        }
      ]
    });

    channel.send(`🎟️ Ticket erstellt von <@${message.author.id}>`);
    message.reply('✅ Dein Ticket wurde erstellt!');
  }
});


client.commands.set('hilfe', {
  name: 'hilfe',
  description: 'Zeigt alle verfügbaren Befehle.',
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setTitle('📖 Hilfe')
      .setDescription([...client.commands.values()].map(cmd => `\`${prefix}${cmd.name}\` – ${cmd.description}`).join('\n'))
      .setColor(0x00ffcc);
    await message.reply({ embeds: [embed] });
  }
});

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

//ban
module.exports = {
  name: 'ban',
  description: 'Bannt einen Benutzer vom Server.',
  async execute(client, message, args) {
    // Rechte-Check
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ content: '❌ Du hast keine Berechtigung, Mitglieder zu bannen.' });
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';

    if (!member) {
      return message.reply({ content: '❌ Bitte erwähne einen Benutzer, der gebannt werden soll.' });
    }

    if (!member.bannable) {
      return message.reply({ content: '❌ Ich kann diesen Benutzer nicht bannen.' });
    }

    try {
      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setTitle('🔨 Benutzer gebannt')
        .setDescription(`**${member.user.tag}** wurde erfolgreich gebannt.\n**Grund:** ${reason}`)
        .setColor(0xff0000)
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Ban-Fehler:', err);
      return message.reply({ content: '❌ Beim Bannen ist ein Fehler aufgetreten.' });
    }
  }
};

// 🛡️ Anti-Alt & Auto-Rolle
client.on('guildMemberAdd', async member => {
  const MIN_ACCOUNT_AGE = 1000 * 60 * 60 * 24 * 7;
  const age = Date.now() - member.user.createdAt.getTime();

  if (age < MIN_ACCOUNT_AGE) {
    await member.kick('Anti-Alt: Account zu jung').catch(console.error);
    const logChannel = member.guild.channels.cache.find(c => c.name === 'join-logs');
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(0xffcc00)
        .setTitle('🛡️ Anti-Alt')
        .setDescription(`${member.user.tag} wurde gekickt (Account zu jung).`)
        .setTimestamp(new Date());
      logChannel.send({ embeds: [embed] });
    }
    return;
  }

  const joinRoleId = '1370730001024028812';
  const role = member.guild.roles.cache.get(joinRoleId);
  if (role) {
    member.roles.add(role).catch(console.error);
  }
});

// ⚙️ Befehl ausführen
client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    const embed = new EmbedBuilder()
      .setTitle('❌ Fehler')
      .setDescription('Beim Ausführen des Befehls ist ein Fehler aufgetreten.')
      .setColor(0xff0000);
    message.reply({ embeds: [embed] });
  }
});

// 🌐 Healthcheck-Server für Koyeb
const port = process.env.PORT || 8000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
}).listen(port, () => {
  console.log(`✅ Healthcheck-Server läuft auf Port ${port}`);
});

// 🚀 Bot starten
if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN fehlt in den Environment Variables!");
  process.exit(1);
}
client.login(process.env.DISCORD_TOKEN);
