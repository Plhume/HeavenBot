const { Command } = require('@sapphire/framework');
const {
    PermissionFlagsBits,
    CommandInteraction,
    EmbedBuilder,
    Colors
} = require('discord.js');
const Duration = require('duration');

const { getDevmodeStatus } = require('../../dev')
const { sendDevmodeLog } = require('../../log')
const { openDatabase } = require('../../db')
const { openVoiceDatabase } = require('../../voicedb')

class ScoreboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'scoreboard',
            description: 'Permet d\'obtenir le scoreboard des messages envoyés.',
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('scoreboard')
                .setDescription('Permet d\'obtenir le scoreboard des messages envoyés.')
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const db = await openDatabase();
        const vdb = await openVoiceDatabase();
        if (getDevmodeStatus() === true) {
            return sendDevmodeLog(interaction)
        } else {
            const scoreboard = await db.all('SELECT * FROM messages ORDER BY messageCount DESC LIMIT 50');
            const serverTotal = await db.get('SELECT SUM(messageCount) as total FROM messages');

            const sb2 = await vdb.all('SELECT userId, time FROM voice ORDER BY time DESC LIMIT 50');
            const serverTotal2 = await vdb.get('SELECT SUM(time) as totalTime FROM voice');

            const top50PromisesMsg = scoreboard.map(async (row, index) => {
                const member = await interaction.guild.members.fetch(row.userId).catch(() => null);
                const user = member ? `<@${member.user.id}>` : 'Utilisateur inconnu';
                return index + 1 === 1 ? `🥇 ${user} **-** ${row.messageCount}` : index + 1 === 2 ? `🥈 ${user} **-** ${row.messageCount}` : index + 1 === 3 ? `🥉 ${user} **-** ${row.messageCount}` : `\`\`${index + 1}\`\` ${user} **-** ${row.messageCount}`;
            });

            const top50PromisesVoice = sb2.map(async (row, index) => {
                const time = row.time;
                const duration = new Duration(new Date(Date.now() - time), new Date(Date.now()));
                row.time = duration.toString(1, 2);

                const member = await interaction.guild.members.fetch(row.userId).catch(() => null);
                const user = member ? `<@${member.user.id}>` : 'Utilisateur inconnu';
                return index + 1 === 1 ? `🥇 ${user} **-** ${row.time}` : index + 1 === 2 ? `🥈 ${user} **-** ${row.time}` : index + 1 === 3 ? `🥉 ${user} **-** ${row.time}` : `\`\`${index + 1}\`\` ${user} **-** ${row.time}`;
            });

            const top50Msg = await Promise.all(top50PromisesMsg);
            const top50Voice = await Promise.all(top50PromisesVoice);

            const scoreEmbed = new EmbedBuilder({
                title: '🏆 | Classement des messages envoyés',
                description: '**Total du serveur :** ' + serverTotal.total + ' messages\n**Total des participants :** ' + scoreboard.length + ' participants\n\n' + top50Msg.join('\n'),
                color: Colors.Navy
            });

            const totalDuration = new Duration(new Date(Date.now() - serverTotal2.totalTime), new Date(Date.now()));
            const scoreEmbed2 = new EmbedBuilder({
                title: '🏆 | Classement des minutes en vocal',
                description: '**Total du serveur :** ' + totalDuration.toString(1, 2) + '\n**Total des participants :** ' + sb2.length + ' participants\n\n' + top50Voice.join('\n'),
                color: Colors.Navy
            });

            await interaction.reply({
                embeds: [scoreEmbed, scoreEmbed2]
            })
        }
    }
}
module.exports = {
    ScoreboardCommand
};