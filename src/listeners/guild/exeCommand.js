const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();

class InteractionCreate extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.InteractionCreate
      });
   }

   run(interaction) {
      /*const client = this.container.client;

      if (interaction.isButton()) return;
      if (interaction.isModalSubmit()) return;

      const logEmbed = new EmbedBuilder({
         title: '🤖 | Commande exécutée > logs',
         description: `<@${interaction.user.id}> vient d'exécuter la commande /${interaction.commandName}**`,
         color: Colors.Orange,
         timestamp: Date.now(),
         fields: [
            {
               name: 'Salon',
               value: '<#' + interaction.channel.id + '>',
            }
         ],
         footer: {
            text: '© 2024 | Heaven',
            icon_url: client.user.avatarURL()
         }
      });

      client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
         content: ``,
         embeds: [logEmbed]
      });*/
   }
}
module.exports = {
   InteractionCreate
};