const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors, GuildChannel } = require('discord.js');
require('dotenv').config();

class ChannelDeleted extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.ChannelDelete
      });
   }

   /**
    * 
    * @param {GuildChannel} channel 
    */
   async run(channel) {
      const client = this.container.client;
      const channelName = channel.name;

      if (channelName.includes('ticket') || channelName.includes('closed')) return;

      const logEmbed = new EmbedBuilder({
         title: '💬 | Salon supprimé > logs',
         description: `Le salon **${channelName}** vient d'être supprimé !`,
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
   ChannelDeleted
};