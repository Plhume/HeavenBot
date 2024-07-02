const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');
const levelsPath = path.resolve(__dirname, '../../lib/levels.json');

class ScoreboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'scoreboard',
            description: 'Affiche les membres du serveur avec leurs niveaux et expériences.'
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('scoreboard')
                .setDescription('Affiche les membres du serveur avec leurs niveaux et expériences.')
        );
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();
        let levels = {};
        if (fs.existsSync(levelsPath)) {
            try {
                levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
            } catch (error) {
                console.error('Error reading levels file:', error);
            }
        }

        const sortedUsers = Object.keys(levels)
            .map(userId => ({ userId, ...levels[userId] }))
            .sort((a, b) => b.level - a.level || b.exp - a.exp);

        const itemsPerPage = 20;
        const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

        const generateEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const pageUsers = sortedUsers.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle('🏆 | Scoreboard')
                .setColor(Colors.Gold)
                .setFooter({ text: `Page ${page + 1} sur ${totalPages}` });

            pageUsers.forEach((user, index) => {
                embed.addFields({ name: `${start + index + 1}. ${interaction.guild.members.cache.get(user.userId).user.tag}`, value: `\`\`Niveau: ${user.level}, EXP: ${user.exp}\`\``, inline: false });
            });

            return embed;
        };

        const generateButtons = (page) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Précédent')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Suivant')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages - 1)
            );
        };

        let currentPage = 0;
        const embedMessage = await interaction.editReply({
            embeds: [generateEmbed(currentPage)],
            components: [generateButtons(currentPage)]
        });

        const collector = embedMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "Vous ne pouvez pas utiliser ces boutons.", ephemeral: true });
            }

            if (i.customId === 'previous') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }

            await i.update({ embeds: [generateEmbed(currentPage)], components: [generateButtons(currentPage)] });
        });

        collector.on('end', async () => {
            await embedMessage.edit({ components: [] });
        });
    }
}

module.exports = {
    ScoreboardCommand
};