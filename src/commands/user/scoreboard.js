const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');
const levelsPath = path.resolve(__dirname, '../../lib/levels.json');

class ScoreboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'scoreboard',
            description: 'Affiche les 20 premiers membres avec des boutons pour naviguer entre les pages.'
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('scoreboard')
                .setDescription('Affiche les 20 premiers membres avec des boutons pour naviguer entre les pages.')
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

        const generateEmbed = async (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const pageUsers = sortedUsers.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle('🏆 | Classement des Membres')
                .setColor(Colors.Gold)
                .setFooter({ text: `Page ${page + 1} sur ${totalPages}` })
                .setTimestamp();

            let description = '';

            for (let i = 0; i < pageUsers.length; i++) {
                const user = pageUsers[i];
                try {
                    const member = await interaction.guild.members.fetch(user.userId);
                    description += `**${start + i + 1}.** ${member} - Niveau: \`${user.level}\`, EXP: \`${user.exp}\`\n\n`;
                } catch (error) {
                    console.error(`Could not fetch member with ID ${user.userId}:`, error);
                    description += `**${start + i + 1}.** Utilisateur inconnu - Niveau: \`${user.level}\`, EXP: \`${user.exp}\`\n\n`;
                }
            }

            embed.setDescription(description);

            return embed;
        };

        const generateButtons = (page) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('⬅️ Précédent')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('➡️ Suivant')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages - 1)
            );
        };

        let currentPage = 0;
        const embedMessage = await interaction.editReply({
            embeds: [await generateEmbed(currentPage)],
            components: [generateButtons(currentPage)]
        });

        const collector = embedMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "Vous ne pouvez pas utiliser ces boutons.", ephemeral: true });
            }

            if (i.customId === 'previous') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }

            await i.update({ embeds: [await generateEmbed(currentPage)], components: [generateButtons(currentPage)] });
        });

        collector.on('end', async () => {
            await embedMessage.edit({ components: [] });
        });
    }
}

module.exports = {
    ScoreboardCommand
};