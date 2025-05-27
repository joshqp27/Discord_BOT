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
