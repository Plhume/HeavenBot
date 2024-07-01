const { Command } = require('@sapphire/framework');
const {
    PermissionFlagsBits,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    Colors,
    ButtonBuilder
} = require('discord.js');
require('dotenv').config()
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')
const { openVoiceDatabase, removeVoiceTime } = require('../../voicedb')

class SBSuppVoiceUsr extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'sbsuppvoiceusr',
            description: 'Permet de retirer un membre du scoreboard',
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('sbsuppvoiceusr')
                .setDescription('Permet de retirer un membre du scoreboard')
                .addNumberOption((option) =>
                    option
                        .setName('nombre')
                        .setDescription('Le nombre du classement à retirer')
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        if (getDevmodeStatus() === true) {
            return sendDevmodeLog(interaction)
        } else {
            const client = this.container.client;
            const member = interaction.member;
            const number = interaction.options.getNumber('nombre');

            if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
                if (member.id !== process.env.OWNER_ID) {
                    return interaction.reply({
                        content: 'Vous n\'avez pas la permission d\'utiliser cette commande !',
                        ephemeral: true
                    });
                }
            }

            const index = number - 1;
            const db = await openVoiceDatabase();
            const scoreboard = await db.all('SELECT * FROM voice ORDER BY time DESC LIMIT 50');
            const user = await client.users.fetch(scoreboard[index].userId);

            await removeVoiceTime(user.id);

            await interaction.reply({
                content: `Le membre <@${user.id}> a été retiré du classement.`,
                ephemeral: true
            });

            const logEmbed = new EmbedBuilder({
                title: '🏆 | Classement modifié',
                description: `<@${member.id}> vient de retirer <@${user.id}> du classement.`,
                color: Colors.DarkNavy,
                timestamp: Date.now(),
                footer: {
                    text: '© 2024 | Heaven',
                    icon_url: client.user.avatarURL()
                }
            })

            interaction.guild.channels.cache.get(process.env.LOG_CHANNEL).send({
                embeds: [logEmbed]
            });
        }
    }
}
module.exports = {
    SBSuppVoiceUsr
};