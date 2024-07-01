const { Command } = require('@sapphire/framework');
const {
   EmbedBuilder,
   Colors
} = require('discord.js');
require('dotenv').config()
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')

class AnonymCommand extends Command {
   constructor(context, options) {
      super(context, {
         ...options,
         name: 'anonym',
         description: 'Permet d\'envoyer un message anonyme.',
         cooldownDelay: 3000
      });
   }

   registerApplicationCommands(registry) {
      registry.registerChatInputCommand((builder) =>
         builder
            .setName('anonym')
            .setDescription('Permet d\'envoyer un message anonyme.')
            .addStringOption((option) =>
               option
                  .setName('message')
                  .setDescription('Message à envoyer')
                  .setRequired(true)
            )
      );
   }

   async chatInputRun(interaction) {
      if (interaction.user.id !== process.env.OWNER_ID) {
         if (getDevmodeStatus() === true) {
            return sendDevmodeLog(interaction)
         }
      }

      const message = interaction.options.getString('message');
      const client = this.container.client

      const channel = interaction.guild.channels.cache.get('1223674596381692085')

      if (interaction.user.id !== process.env.OWNER_ID) {
         if (interaction.channel.id !== channel.id) {
            return interaction.reply({
               content: `Vous devez utiliser la commande dans le salon ${channel} !`,
               ephemeral: true
            });
         }
      }

      const embed = new EmbedBuilder({
         title: 'Message anonyme !',
         description: message,
         color: Colors.Navy
      })

      if (message.includes('<@')) {
         if (message.includes('<@&')) {
            return interaction.reply({
               content: 'Vous ne pouvez pas mentionner un rôle !',
               ephemeral: true
            });
         }

         const userMention = message.match(/<@!?(\d+)>/)[1];
         const user = await client.users.fetch(userMention);

         await interaction.channel.send({
            content: `<@${user.id}>`,
            embeds: [embed]
         });
      } else {
         await interaction.channel.send({
            content: '',
            embeds: [embed]
         });
      }

      const messageLink = await interaction.channel.messages.fetch({ limit: 1 });
      const logEmbed = new EmbedBuilder({
         title: '👤 | Anonym > logs',
         description: `<@${interaction.user.id}> a envoyé un message anonyme !`,
         color: Colors.Navy,
         timestamp: Date.now(),
         fields: [
            {
               name: 'Vers le message',
               value: `[Cliquez ici](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${messageLink.first().id})`,
            }
         ],
         footer: {
            text: '© 2024 | Heaven',
            icon_url: client.user.avatarURL()
         }
      });

      client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.CONFESS_CHANNEL).send({
         content: ``,
         embeds: [logEmbed]
      });

      await interaction.reply({
         content: 'Votre message a bien été envoyé !',
         ephemeral: true
      });
   }
}
module.exports = {
   AnonymCommand
};