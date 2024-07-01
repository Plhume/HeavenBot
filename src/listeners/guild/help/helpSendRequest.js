const { Listener, Events } = require('@sapphire/framework');
const { CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, EmbedBuilder, Colors, ButtonStyle } = require('discord.js');
require('dotenv').config();

class InteractionCreate extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.InteractionCreate
        });
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId == 'openHelpModal') {
                const client = this.container.client
                const user = interaction.user;
                const guild = interaction.guild;

                const request = interaction.fields.getTextInputValue('requestInput');

                const channel = interaction.guild.channels.cache.get('1056394266525581342')

                const embed = new EmbedBuilder({
                    title: 'Demande d\'aide !',
                    description: request,
                    color: Colors.Gold
                })

                // if the request contains @ and a username, get the user of the username, and replace the username with the user's mention
                // an example, @plhume is replaced with <@716639931610562563>
                const requestWithMentions = request.replace(/@(\w+)/g, (match, username) => {
                    const user = guild.members.cache.find(member => member.user.username === username);
                    return user ? `<@${user.id}>` : match;
                });

                const embedWithMentions = new EmbedBuilder({
                    title: 'Demande d\'aide !',
                    description: requestWithMentions,
                    color: Colors.Gold
                })



                await channel.send({
                    embeds: [embedWithMentions]
                });

                const messageLink = await channel.messages.fetch({ limit: 1 });
                const logEmbed = new EmbedBuilder({
                    title: '🤝 | Demandes d\'aide > logs',
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

                client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
                    embeds: [logEmbed]
                });

                await interaction.reply({
                    content: 'Votre message a bien été envoyé !',
                    ephemeral: true
                });
            }
        }
    }
}
module.exports = {
    InteractionCreate
};