const { Listener, Events } = require('@sapphire/framework');
const { CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, ChannelType, GuildChannel, ButtonBuilder, Colors } = require('discord.js');
require('dotenv').config();

class InteractionCreate extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.InteractionCreate
      });
   }

   /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {GuildChannel} channel
    */
   async run(interaction) {
      if (interaction.isButton()) {
         if (interaction.customId == 'closeButton') {
            const client = this.container.client
            const user = interaction.user;
            const channel = interaction.channel;
            const guild = interaction.guild;

            if (channel.name.startsWith('ticket-')) {
               await channel.permissionOverwrites.delete(user.id);

               await channel.permissionOverwrites.set([
                  {
                     id: '1056394061084381204',
                     deny: [
                        PermissionFlagsBits.SendMessages
                     ]
                  }
               ])

               const closeParentId = '1060044156472414228';
               const closeParent = await guild.channels.fetch(closeParentId);

               if (!closeParent || closeParent.type !== ChannelType.GuildCategory) {
                  return interaction.reply({
                     content: 'Le salon de tickets n\'a pas été trouvé.',
                     ephemeral: true
                  });
               }

               const channelName = channel.name;
               const newTicketName = `closed-${channelName.split('-')[1]}`;
               await channel.setName(newTicketName);
               await channel.setParent(closeParent)

               const deleteButton = new ButtonBuilder({
                  custom_id: 'deleteButton',
                  label: '🔮 Supprimer le ticket',
                  style: ButtonStyle.Danger,
                  disabled: false
               });
   
               const row = new ActionRowBuilder().addComponents(deleteButton);

               await interaction.reply({
                  content: `Le ticket a bien été fermé par <@${interaction.user.id}> !`,
                  components: [row]
               });
            } else {
               await interaction.reply({
                  content: `Le ticket a déjà été fermé !`
               })
            }

            const logsChannel = await guild.channels.fetch(process.env.LOG_TICKETS);
            const logEmbed = new EmbedBuilder({
               author: {
                  name: user.username,
                  icon_url: user.avatarURL()
               },
               title: '🎫 | Fermeture d\'un ticket',
               fields: [
                  {
                     name: 'Fermé par',
                     value: `<@${user.id}>`,
                     inline: true
                  },
                  {
                     name: 'Ticket',
                     value: `<#${interaction.channel.id}>`,
                     inline: true
                  }
               ],
               color: Colors.DarkGreen,
               timestamp: Date.now(),
               footer: {
                  text: '© 2024 | Heaven',
                  icon_url: client.user.avatarURL()
               }
            });

            await logsChannel.send({
               embeds: [logEmbed]
            });
         }
      }
   }
}
module.exports = {
   InteractionCreate
};