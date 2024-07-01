const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')

class InfoCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'info',
            description: 'Permet d\'envoyer le menu d\'informations.'
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('info')
                .setDescription('Permet d\'envoyer le menu d\'informations.')
        );
    }

    async chatInputRun(interaction) {
        if (getDevmodeStatus() === true) {
            return sendDevmodeLog(interaction)
        } else {
            const { version } = require('../../config.json')

            const helpEmbed = new EmbedBuilder({
                title: '👋 | Menu des informations',
                description: 'Développé et maintenu à jour par <@716639931610562563> ❤️ !\n\n' + version,
                color: Colors.Gold,
                timestamp: Date.now(),
                footer: {
                    text: '© 2024 | Heaven',
                    icon_url: this.container.client.user.avatarURL()
                }
            })

            interaction.reply({
                embeds: [helpEmbed],
                ephemeral: true
            })
        }
    }
}
module.exports = {
    InfoCommand
};