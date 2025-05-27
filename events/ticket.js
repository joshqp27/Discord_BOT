const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
} = require('discord.js');

const TICKET_CATEGORY_ID = '1375092669428011158';      // Kategorie für Tickets
const TICKET_MESSAGE_CHANNEL_ID = '1371194832537522187'; // Channel, in dem der Button gepostet wird

module.exports = (client) => {
  client.once('ready', async () => {
    console.log(`Eingeloggt als ${client.user.tag}`);

    let channel = client.channels.cache.get(TICKET_MESSAGE_CHANNEL_ID);
    if (!channel) {
      try {
        channel = await client.channels.fetch(TICKET_MESSAGE_CHANNEL_ID);
      } catch {
        return console.log('Ticket-Channel nicht gefunden');
      }
    }

    const button = new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('Ticket öffnen')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await channel.send({
      content: 'Klicke hier, um ein Ticket zu öffnen:',
      components: [row],
    });
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'open_ticket') return;

    const guild = interaction.guild;
    if (!guild)
      return interaction.reply({
        content: 'Dieser Befehl funktioniert nur auf einem Server.',
        ephemeral: true,
      });

    // Prüfen, ob User bereits ein Ticket hat
    const existingChannel = guild.channels.cache.find(
      (c) => c.name === `ticket-${interaction.user.id}`
    );
    if (existingChannel) {
      return interaction.reply({
        content: `Du hast bereits ein offenes Ticket: ${existingChannel}`,
        ephemeral: true,
      });
    }

    const category = guild.channels.cache.get(TICKET_CATEGORY_ID);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.reply({
        content: 'Ticket-Kategorie wurde nicht gefunden oder ist ungültig.',
        ephemeral: true,
      });
    }

    // Erstelle Ticket-Channel
    const ticketChannel = await guild.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: client.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageChannels,
          ],
        },
      ],
    });

    await ticketChannel.send(
      `${interaction.user}, dein Ticket wurde erstellt. Ein Teammitglied wird sich bald bei dir melden.`
    );

    await interaction.reply({
      content: `Dein Ticket wurde erstellt: ${ticketChannel}`,
      ephemeral: true,
    });
  });
};
