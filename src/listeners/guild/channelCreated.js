const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors, GuildChannel } = require('discord.js');
require('dotenv').config();

class ChannelCreated extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.ChannelCreate
      });
   }

   /**
    * 
    * @param {GuildChannel} channel 
    */
   async run(channel) {
      const client = this.container.client;
      const channelName = channel.name;
      const channelId = channel.id;
      let parent;

      if (channelName.includes('ticket') || channelName.includes('closed')) return;

      if (!parent) {
         parent = 'Aucune'
      } else {
         parent = `<#${channel.parentId}>`
      }

      const logEmbed = new EmbedBuilder({
         title: '💬 | Salon créé > logs',
         description: `Le salon <#${channelId}> vient d'être créé !`,
         fields: [
            {
               name: 'Catégorie',
               value: `${parent}`,
               inline: true
            },
            {
               name: 'Nom',
               value: `${channelName}`,
               inline: true
            },
            {
               name: 'Id',
               value: `${channelId}`,
               inline: false
            },
         ],
         color: Colors.White,
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
   ChannelCreated
};