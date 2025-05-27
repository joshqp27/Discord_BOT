const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField
} = require('discord.js');
const config = require('./config.json');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// 🔃 Befehle laden
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);
      if (command.name) client.commands.set(command.name, command);
    }
  }
}
loadCommands(path.join(__dirname, 'commands'));




// 🎉 Neumitglied: Rolle vergeben & Alt-Account-Check
client.on('guildMemberAdd', async member => {
  const MIN_ACCOUNT_AGE = 1000 * 60 * 60 * 24 * 7; // 7 Tage
  const age = Date.now() - member.user.createdAt.getTime();

  // Anti-Alt-Kick
  if (age < MIN_ACCOUNT_AGE) {
    await member.kick('Anti-Alt: Account zu jung').catch(console.error);
    const logChannel = member.guild.channels.cache.find(c => c.name === 'join-logs');
    if (logChannel) {
      logChannel.send({
        embeds: [{
          color: 0xffcc00,
          title: '🛡️ Anti-Alt',
          description: `${member.user.tag} wurde gekickt (Account zu jung).`,
          timestamp: new Date().toISOString()
        }]
      });
    }
    return;
  }

  // Rolle vergeben
  const joinRoleId = '1370730001024028812';
  const role = member.guild.roles.cache.get(joinRoleId);
  if (role) {
    member.roles.add(role).catch(console.error);
  }
});

// ⚙️ Befehle ausführen
client.on('messageCreate', async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    const { createEmbed } = require('./utils/embed');
    const errorEmbed = createEmbed({
      title: '❌ Fehler',
      description: 'Beim Ausführen des Befehls ist ein Fehler aufgetreten.',
      color: 0xff0000,
    });
    message.reply({ embeds: [errorEmbed] });
  }
});

// 📡 Bot starten
client.login(config.token);
