const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Colors, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const levelsPath = path.resolve(__dirname, '../../lib/levels.json');

class LevelCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'adminrank',
            description: 'Permet d\'ajouter ou de supprimer le niveau d\'un utilisateur.',
            requiredUserPermissions: [PermissionFlagsBits.Administrator]
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('adminrank')
                .setDescription('Permet d\'ajouter ou de supprimer le niveau d\'un utilisateur.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('Utilisateur à ajouter ou supprimer le niveau.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('level')
                        .setDescription('Niveau du membre.')
                        .setRequired(true)
                        .setMinValue(1)
                )
                .addIntegerOption(option =>
                    option
                        .setName('exp')
                        .setDescription('Expérience du membre.')
                        .setRequired(false)
                        .setMinValue(0)
                )
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const userId = interaction.user.id;
        const user = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level');
        const exp = interaction.options.getInteger('exp');

        if (user.bot) return interaction.reply({ content: 'Vous ne pouvez pas ajouter ou supprimer le niveau d\'un bot !', ephemeral: true });
        if (!user) return interaction.reply({ content: 'Vous devez spécifier un utilisateur !', ephemeral: true });

        if (level < 1) return interaction.reply({ content: 'Vous devez spécifier un niveau supérieur à 1 !', ephemeral: true });
        if (exp && exp < 0) return interaction.reply({ content: 'Vous devez spécifier une expérience supérieure à 0 !', ephemeral: true });
        if (exp && exp > getNextLevelExp(level)) return interaction.reply({ content: 'Vous ne pouvez pas ajouter de expérience à un niveau supérieur à celui du membre !', ephemeral: true });

        const levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
        if (!levels[user.id]) {
            levels[user.id] = { exp: 0, level: 1 };
        }

        if (exp && exp > levels[user.id].level) {
            levels[user.id].exp = exp;
            levels[user.id].level = level;
        } else if (exp) {
            levels[user.id].exp += exp;
        } else if (level > levels[user.id].level) {
            levels[user.id].level = level;
        }

        const userLevel = levels[user.id].level;
        const userExp = levels[user.id].exp;
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