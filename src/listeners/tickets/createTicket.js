const { Listener, Events } = require('@sapphire/framework');
const { CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, EmbedBuilder, Colors, ButtonStyle } = require('discord.js');
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
    */
   async run(interaction) {
      if (interaction.isModalSubmit()) {
         if (interaction.customId == 'openModal') {
            const client = this.container.client
            const user = interaction.user;
            const guild = interaction.guild;
            
            const reason = interaction.fields.getTextInputValue('reasonInput');

            const parentId = '1060044156472414228'
            const parent = await guild.channels.fetch(parentId)

            if (!parent || parent.type !== ChannelType.GuildCategory) {
               return interaction.reply({
                  content: 'Le salon de tickets n\'a pas été trouvé.',
                  ephemeral: true
               });
            }

            const ticketName = `ticket-${user.username.toLowerCase()}`;

            const ticket = await guild.channels.create({
               type: ChannelType.GuildText,
               name: ticketName,
               parent: parent,
               permissionOverwrites: [
                  {
                     id: user.id,
                     allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.AttachFiles,
                     ]
                  },
                  {
                     id: '1056394061084381204',
                     allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.AttachFiles,
                     ]
                  },
                  {
                     id: guild.roles.everyone,
                     deny: [PermissionFlagsBits.ViewChannel]
                  }
               ]
            });

            await interaction.reply({
               content: 'Votre ticket à bien été ouvert : <#' + ticket.id + '>',
               ephemeral: true 
            });

            const closeButton = new ButtonBuilder({
               custom_id: 'closeButton',
               label: '🔒 Fermer le ticket',
               style: ButtonStyle.Danger,
               disabled: false
            });

            const row = new ActionRowBuilder().addComponents(closeButton);

            const welcomeEmbed = new EmbedBuilder({
               author: {
                  name: user.username,
                  icon_url: user.avatarURL()
               },
               title: '👋 Bienvenue ' + user.username + ' dans votre ticket !',
               description: `Merci \`\`de ne pas mentionner les membres du staff\`\`, ils prendront votre ticket au plus vite !\n
               > **Raison du ticket :** ${reason}`,
               color: Colors.Purple,
               timestamp: Date.now(),
               footer: {
                  text: '© 2024 | Heaven',
                  icon_url: client.user.avatarURL()
               }
            })

            await ticket.send({
               content: `<@${user.id}>, <@&1056394061084381204>`,
               embeds: [welcomeEmbed],
               components: [row]
            });

            const logsChannel = await guild.channels.fetch(process.env.LOG_TICKETS);
            const logEmbed = new EmbedBuilder({
               author: {
                  name: user.username,
                  icon_url: user.avatarURL()
               },
               title: '🎫 | Ouverture d\'un ticket',
               fields: [
                  {
                     name: 'Ouvert par',
                     value: `<@${user.id}>`,
                     inline: true
                  },
                  {
                     name: 'Ticket',
                     value: `<#${ticket.id}>`,
                     inline: true
                  },
                  {
                     name: 'Raison',
                     value: reason,
                     inline: false
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