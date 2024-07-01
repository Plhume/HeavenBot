const { Command } = require('@sapphire/framework');
const {
    PermissionFlagsBits,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    Colors,
    ButtonBuilder
} = require('discord.js');
const Duration = require('duration');
require('dotenv').config()

const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog, sendLog } = require('../../log')
const { openVoiceDatabase, setVoiceTime } = require('../../voicedb')

class SBSetVoiceCmd extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'sbsetvoice',
            description: 'Permet de définir le temps en vocal d\'un membre.',
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('sbsetvoice')
                .setDescription('Permet de définir le temps en vocal d\'un membre.')
                .addUserOption((option) =>
                    option
                        .setName('membre')
                        .setDescription('Membre à définir')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('mois')
                        .setDescription('Le temps à définir (en mois)')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('jours')
                        .setDescription('Le temps à définir (en jours)')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('heures')
                        .setDescription('Le temps à définir (en heures)')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('minutes')
                        .setDescription('Le temps à définir (en minutes)')
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
            const mois = interaction.options.getNumber('mois');
            const jours = interaction.options.getNumber('jours');
            const heures = interaction.options.getNumber('heures');
            const minutes = interaction.options.getNumber('minutes');

            if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
                if (member.id !== process.env.OWNER_ID) {
                    return interaction.reply({
                        content: 'Vous n\'avez pas la permission d\'utiliser cette commande !',
                        ephemeral: true
                    });
                }
            }

            const time = (mois * 2592000000) + (jours * 86400000) + (heures * 3600000) + (minutes * 60000);

            await setVoiceTime(user.id, time)
            const duration = new Duration(new Date(Date.now() - time), new Date(Date.now()));
            await interaction.reply({
                content: `Temps passé en vocal de <@${user.id}> définis à ${duration.toString(1, 2)}.`,
                ephemeral: true
            });

            const logEmbed = new EmbedBuilder({
                title: '🏆 | Classement modifié',
                description: `<@${member.id}> vient de définir le temps passé en vocal de <@${user.id}> à \`\`${duration.toString(1, 2)}\`\`.`,
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
    SBSetVoiceCmd
};