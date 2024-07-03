const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();

class GuildMemberAdd extends Listener {
   constructor(context, options) {
      super(context, {
         ...options,
         event: Events.GuildMemberAdd
      });
   }

   async run(member) {
      const client = this.container.client;
      const WELCOME_MESSAGES = [
         `Souhaitons la bienvenue à <@${member.user.id}>, qui est arrivé.e de loin !`,
         `Nous espérons que tu as apporté quelque chose pour ton arrivée <@${member.user.id}> !`,
         `Bienvenue <@${member.user.id}> sur le serveur ! N'hésite pas à rester, c'est quand même plus sympa !`
      ]

      const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
      const randomMessage = WELCOME_MESSAGES[randomIndex];

      await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get('1056394219289313310').send(randomMessage);

      const embed = new EmbedBuilder({
         title: '👋 | Nouveau membre',
         description: `Bienvenue à toi **${member.user.username}** sur le serveur !\n\nAvant toute chose, je t'invite à prendre tes rôles dans le salon "Salons et Rôles" (tout en haut dans la liste) qui sont **obligatoires**. Merci également de prendre connaissances du <#1056394180378767440> ainsi que de l'approuver.\n\nSi tu as la moindre question, n'hésite pas à contacter un <@&1056394057854750720> !`,
         color: Colors.Blue,
      })

      const msg = await client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.INFO_CHANNEL).send({
         content: `# Bienvenue sur Heaven, <@${member.user.id}> !`,
         embeds: [embed]
      });

      await msg.react('👋');

      const logEmbed = new EmbedBuilder({
         title: '👤 | Nouveau membre > logs',
         description: `${member.user.username} vient de rejoindre le serveur.`,
         fields: [
            {
               name: 'ID',
               value: member.user.id,
               inline: true
            },
            {
               name: 'Nom',
               value: member.user.username,
               inline: true
            },
            {
               name: 'Créé le',
               value: member.user.createdAt,
               inline: true
            }
         ],
         color: Colors.Blue,
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
   GuildMemberAdd
};