const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();

class GuildMemberRemove extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.GuildMemberRemove
      });
   }

   async run(member) {
      const client = this.container.client;

      const embed = new EmbedBuilder({
         title: '👋 | Un membre est parti',
         description: `**${member.user.username}** vient de nous quitter... Bonne continuation à lui !`,
         color: Colors.Blue,
      })

      await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.INFO_CHANNEL).send({
         embeds: [embed]
      });

      const logEmbed = new EmbedBuilder({
         title: '👤 | Membre parti > logs',
         description: `<@${member.user.id}> vient de quitter le serveur.`,
         color: Colors.Aqua,
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
      return;

   }
}
module.exports = {
   GuildMemberRemove
};