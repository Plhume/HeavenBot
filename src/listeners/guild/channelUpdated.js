const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors, GuildChannel } = require('discord.js');
require('dotenv').config();

class ChannelUpdated extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.ChannelUpdate
      });
   }

   /**
    * 
    * @param {GuildChannel} oldChannel 
    * @param {GuildChannel} newChannel 
    */
   async run(oldChannel, newChannel) {
      const client = this.container.client;
      if (channelName.includes('ticket') || channelName.includes('closed')) return;

      // UPDATE CHANNELNAME
      if (oldChannel.name !== newChannel.name) {
         const logEmbed = new EmbedBuilder({
            title: '💬 | Salon modifié > logs',
            description: `Le salon <#${newChannel.id}> à été renommé !`,
            fields: [
               {
                  name: 'Ancien nom',
                  value: oldChannel.name,
                  inline: true
               },
               {
                  name: 'Nouveau nom',
                  value: newChannel.name,
                  inline: true
               }
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

      // UPDATE PERMISSIONS
      else if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
         const logEmbed = new EmbedBuilder({
            title: '💬 | Salon modifié > logs',
            description: `Les permissions du salon <#${newChannel.id}> ont été modifiées !`,
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
}
module.exports = {
   ChannelUpdated
};