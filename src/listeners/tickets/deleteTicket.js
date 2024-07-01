const { Listener, Events } = require('@sapphire/framework');
const { CommandInteraction, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits, ChannelType, Colors } = require('discord.js');
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
        if (interaction.isButton()) {
            if (interaction.customId == 'deleteButton') {
                const client = this.container.client
                const user = interaction.user;
                const channel = interaction.channel;
                const guild = interaction.guild;

                if (channel.name.startsWith('closed-')) {
                    await interaction.channel.delete()
                } else {
                    await interaction.reply({
                        content: `Ce salon n'est pas un ticket !`
                    })
                }
            }
        }
    }
}
module.exports = {
    InteractionCreate
};