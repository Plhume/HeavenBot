const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();

class MessageUpdated extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.MessageUpdate
      });
   }

   async run(oldMessage, newMessage) {
      const client = this.container.client;
      if (oldMessage.author.bot || newMessage.author.bot) return;

      const logEmbed = new EmbedBuilder({
         title: '📩 | Message édité > logs',
         description: `Message de <@${oldMessage.author.id}> édité dans <#${oldMessage.channel.id}>.`,
         fields: [
            {
               name: 'Ancien message',
               value: oldMessage.content || '❌ Message invalide',
               inline: true
            },
            {
               name: 'Nouveau message',
               value: newMessage.content || '❌ Message invalide',
               inline: true
            }
         ],
         color: Colors.Grey,
         timestamp: Date.now(),
         footer: {
            text: '© 2024 | Heaven',
            icon_url: client.user.avatarURL()
         }
      });

      await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
         content: ``,
         embeds: [logEmbed]
      });
   }
}
module.exports = {
   MessageUpdated
};