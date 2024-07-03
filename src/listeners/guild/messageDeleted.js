const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();

class MessageUpdated extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.MessageDelete
      });
   }

   async run(message) {
      const client = this.container.client;
      if (message.author.bot) return;

      const logEmbed = new EmbedBuilder({
         title: '📩 | Message supprimé > logs',
         description: `Message de <@${message.author.id}> supprimé dans <#${message.channel.id}>.`,
         color: Colors.Grey,
         timestamp: Date.now(),
         footer: {
            text: '© 2024 | Heaven',
            icon_url: client.user.avatarURL()
         }
      });

      await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
         embeds: [logEmbed]
      });
   }
}
module.exports = {
   MessageUpdated
};