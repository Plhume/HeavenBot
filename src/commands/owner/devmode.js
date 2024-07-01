const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits, CommandInteraction, EmbedBuilder, Colors } = require('discord.js');
const { getDevmodeStatus, toggleDevmode } = require('../../dev')

class DevModeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'devmode',
            description: 'Permet de définir le statut du bot (devmode).',
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('devmode')
                .setDescription('Permet de définir le statut du bot (devmode).')
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const msg = interaction.options.getString('message');
        const member = interaction.member;
        const infochannel = interaction.guild.channels.cache.get('1218219464320094339')

        if (member.id !== '716639931610562563') {
            return interaction.reply({
                content: 'Vous n\'êtes pas propriétaire du bot !',
                ephemeral: true
            });
        } else {
            try {
                const devmode = await getDevmodeStatus();
                await toggleDevmode();

                const devmodeEmbed = new EmbedBuilder({
                    title: `Mode développeur > ${devmode ? '❌' : '✅'}`,
                    description: `Le mode développeur à été ${devmode ? 'désactivé' : 'activé'} !`,
                    color: devmode ? Colors.Red : Colors.Green,
                    footer: {
                        text: `Demandé par ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                })

                await interaction.reply({
                    embeds: [devmodeEmbed],
                });
                await infochannel.send({
                    embeds: [devmodeEmbed]
                });
            } catch (error) {
                await interaction.reply({
                    content: `Une erreur est survenue: **${error}**`,
                    ephemeral: true
                });
            }
        }
    }
}
module.exports = {
    DevModeCommand
};