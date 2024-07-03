const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors, GuildMember } = require('discord.js');
require('dotenv').config();

class GuildMemberUpdate extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.GuildMemberUpdate
      });
   }

   /**
    * 
    * @param {GuildMember} oldMember 
    * @param {GuildMember} newMember 
    */
   async run(oldMember, newMember) {
      const client = this.container.client;

      // UPDATE USERNAME
      if (oldMember.user.username !== newMember.user.username) {
         const embed = new EmbedBuilder({
            title: '📝 | Logs',
            description: `<@${oldMember.user.id}> a changé de pseudo.`,
            fields: [
               {
                  name: 'Ancien pseudo',
                  value: oldMember.user.username,
                  inline: true
               },
               {
                  name: 'Nouveau pseudo',
                  value: newMember.user.username,
                  inline: true
               }
            ],
            color: Colors.Aqua,
            timestamp: Date.now(),
            footer: {
               text: '© 2024 | Heaven',
               icon_url: client.user.avatarURL()
            }
         });

         await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
            content: ``,
            embeds: [embed]
         });
      }

      // UPDATE AVATAR
      else if (oldMember.user.avatarURL() !== newMember.user.avatarURL()) {
         const embed = new EmbedBuilder({
            title: '📝 | Logs',
            description: `<@${oldMember.user.id}> a changé d'avatar.`,
            thumbnail: {
               url: newMember.user.avatarURL()
            },
            color: Colors.Aqua,
            timestamp: Date.now(),
            footer: {
               text: '© 2024 | Heaven',
               icon_url: client.user.avatarURL()
            }
         });

         await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
            content: ``,
            embeds: [embed]
         });
      }

      // UPDATE ROLES
      else if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
         const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
         const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

         const embed = new EmbedBuilder({
            title: '📝 | Logs',
            description: `Rôles de <@${oldMember.user.id}> modifiés`,
            fields: [
               {
                  name: `Rôle ${addedRoles.size > 0 ? 'ajouté' : 'supprimé'}`,
                  value: addedRoles.size > 0 ? `<@&${addedRoles.map(role => role.id).join('>, <@&')}>`
                     : `<@&${removedRoles.map(role => role.id).join('>, <@&')}>`,
               },
               {
                  name: 'Rôles actuels',
                  value: `<@&${newMember.roles.cache.map(role => role.id).slice(0, 5).join('>, <@&')}>${newMember.roles.cache.size > 5 ? '…' : ''}`,
               }
            ],
            color: Colors.Aqua,
            timestamp: Date.now(),
            footer: {
               text: '© 2024 | Heaven',
               icon_url: client.user.avatarURL()
            }
         });

         await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
            content: ``,
            embeds: [embed]
         });
      }
   }
}
module.exports = {
   GuildMemberUpdate
};