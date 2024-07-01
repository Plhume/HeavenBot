const { Command } = require('@sapphire/framework');
const {
    PermissionFlagsBits,
    CommandInteraction
} = require('discord.js');
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')

class SayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'say',
            description: 'Permet d\'envoyer un message via le bot.',
            requiredUserPermissions: [PermissionFlagsBits.Administrator]
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('say')
                .setDescription('Permet d\'envoyer un message via le bot.')
                .addStringOption((option) =>
                    option
                        .setName('message')
                        .setDescription('Message à envoyer')
                        .setRequired(true)
                )
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const msg = interaction.options.getString('message');

            if (!msg) {
                return interaction.reply({
                    content: 'Veuillez ajouter un message !',
                    ephemeral: true
                });
            }

            await interaction.channel.send({
                content: msg,
            });

            await interaction.reply({
                content: 'Message envoyé avec succès !',
                ephemeral: true
            });
    }
}
module.exports = {
    SayCommand
};