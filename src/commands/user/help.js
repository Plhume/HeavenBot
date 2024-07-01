const { Command } = require('@sapphire/framework');
const {
   EmbedBuilder,
   Colors
} = require('discord.js');
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')

class HelpCommand extends Command {
   constructor(context, options) {
      super(context, {
         ...options,
         name: 'help',
         description: 'Permet d\'envoyer le menu d\'aide.'
      });
   }

   registerApplicationCommands(registry) {
      registry.registerChatInputCommand((builder) =>
         builder
            .setName('help')
            .setDescription('Permet d\'envoyer le menu d\'aide.')
      );
   }

   async chatInputRun(interaction) {
      if (getDevmodeStatus() === true) {
         return sendDevmodeLog(interaction)
      } else {
         const helpEmbed = new EmbedBuilder({
            title: '📚 | Menu d\'aide',
            description: 'Voici la liste des commandes disponibles.',
            fields: [
               {
                  name: 'Commandes',
                  value: `• /help : Affiche le menu d\'aide
                  • /anonym : Permet d\'envoyer un message anonyme
                  • /info : Permet de voir des informations sur le bot
                  • /aide : Permet d\'envoyer le menu de demandes d\'aide
                  ${interaction.user.id === process.env.OWNER_ID ? '• /devmode : Permet de basculer le mode développeur' : ''}`
               }
            ],
            color: Colors.Gold,
            timestamp: Date.now(),
            footer: {
               text: '© 2024 | Heaven',
               icon_url: this.container.client.user.avatarURL()
            }
         })

         interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true
         })
      }
   }
}
module.exports = {
   HelpCommand
};