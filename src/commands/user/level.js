const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');
const levelsPath = path.resolve(__dirname, '../../lib/levels.json');

class LevelCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'rank',
            description: 'Affiche ton niveau et ton expérience actuelle.'
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('rank')
                .setDescription('Affiche ton niveau et ton expérience actuelle.')
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const userId = interaction.user.id;

        let levels = {};
        if (fs.existsSync(levelsPath)) {
            levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
        }

        if (!levels[userId]) {
            levels[userId] = { exp: 0, level: 1 };
        }

        const userLevel = levels[userId].level;
        const userExp = levels[userId].exp;
        const nextLevelExp = getNextLevelExp(userLevel);

        const expEmbed = new EmbedBuilder({
            author: {
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            },
            title: '💰 Niveaux',
            fields: [
                {
                    name: 'Niveau actuel',
                    value: `\`\`${userLevel}\`\``,
                    inline: true
                },
                {
                    name: 'EXP actuel',
                    value: `\`\`${userExp}\`\``,
                    inline: true
                },
                {
                    name: 'EXP restant',
                    value: `${nextLevelExp - userExp}`,
                    inline: false
                }
            ],
            color: Colors.Blurple,
            timestamp: Date.now(),
            footer: {
                text: '© 2024 | Heaven',
                icon_url: this.container.client.user.avatarURL()
            }
        })

        return interaction.reply({
            embeds: [expEmbed],
        });
    }
}

const getNextLevelExp = (level) => Math.floor(50 * Math.pow(1.4, level - 1));

module.exports = {
    LevelCommand
};