const { Command } = require('@sapphire/framework');
const {
   PermissionFlagsBits,
   ButtonStyle,
   ActionRowBuilder,
   EmbedBuilder,
   Colors,
   ButtonBuilder
} = require('discord.js');
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')

class TicketCommand extends Command {
   constructor(context, options) {
      super(context, {
         ...options,
         name: 'ticket',
         description: 'Permet d\'envoyer le menu des tickets.',
         requiredUserPermissions: PermissionFlagsBits.Administrator
      });
   }

   registerApplicationCommands(registry) {
      registry.registerChatInputCommand((builder) =>
         builder
            .setName('ticket')
            .setDescription('Permet d\'envoyer le menu des tickets.')
      );
   }

   async chatInputRun(interaction) {
      const client = this.container.client;

      const ticketEmbed = new EmbedBuilder({
         title: '🎫 | Ouvrir un ticket',
         description: 'Appuyez sur le bouton ci-dessous pour ouvrir un ticket !',
         color: Colors.Yellow,
         timestamp: Date.now(),
         footer: {
            text: '© 2024 | Heaven',
            icon_url: client.user.avatarURL()
         }
      })

      const openButton = new ButtonBuilder({
         custom_id: 'openButton',
         label: '🎫 Ouvrir un ticket',
         style: ButtonStyle.Secondary,
         disabled: false
      })

      const row = new ActionRowBuilder().addComponents(openButton)

      await interaction.channel.send({
         content: '',
         embeds: [ticketEmbed],
         components: [row]
      })

      await interaction.reply({
         content: 'L\'embed des tickets a bien été envoyé !',
         ephemeral: true
      });
   }
}
module.exports = {
   TicketCommand
};