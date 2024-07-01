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
const { sendDevmodeLog, sendLog } = require('../../log')
const { openDatabase, removeUser, setMessages } = require('../../db')

class SBSetMsgCmd extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'sbsetmsg',
            description: 'Permet de définir les messages envoyés d\'un membre.',
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('sbsetmsg')
                .setDescription('Permet de définir les messages envoyés d\'un membre.')
                .addUserOption((option) =>
                    option
                        .setName('membre')
                        .setDescription('Membre à définir')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('nombre')
                        .setDescription('Nombre de messages envoyés')
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
            const user = interaction.options.getUser('membre');
            const messageCount = interaction.options.getNumber('nombre');

            if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
                if (member.id !== process.env.OWNER_ID) {
                    return interaction.reply({
                        content: 'Vous n\'avez pas la permission d\'utiliser cette commande !',
                        ephemeral: true
                    });
                }
            }

            await setMessages(user.id, messageCount)
            await interaction.reply({
                content: `Messages envoyés de <@${user.id}> définis à ${messageCount}.`,
                ephemeral: true
            });

            const logEmbed = new EmbedBuilder({
                title: '🏆 | Classement modifié',
                description: `<@${member.id}> vient de définir le nombre de messages envoyés de <@${user.id}> à \`\`${messageCount}\`\`.`,
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
    SBSetMsgCmd
};