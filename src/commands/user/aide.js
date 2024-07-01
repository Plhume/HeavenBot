const { Command } = require('@sapphire/framework');
const {
    EmbedBuilder,
    Colors,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');
require('dotenv').config()
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')

class AideCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'aide',
            description: 'Permet d\'envoyer une demande d\'aide',
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('aide')
                .setDescription('Permet d\'envoyer une demande d\'aide.')
        );
    }

    async chatInputRun(interaction) {
        const openModal = new ModalBuilder({
            custom_id: 'openHelpModal',
            title: 'Demande d\'aide - Heaven',
         })

         const reasonInput = new TextInputBuilder({
            custom_id: 'requestInput',
            label: 'Inscrivez ici votre demande d\'aide',
            min_length: 3,
            max_length: 750,
            required: true,
            style: TextInputStyle.Paragraph
         })

         const row = new ActionRowBuilder().addComponents(reasonInput)
         openModal.addComponents(row)

         await interaction.showModal(openModal);
    }
}
module.exports = {
    AideCommand
};