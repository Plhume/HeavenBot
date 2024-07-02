const { SapphireClient, ApplicationCommandRegistries } = require('@sapphire/framework');
const { ActivityType, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const cron = require('node-cron');
const { openDatabase } = require('./db')

const client = new SapphireClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],

    presence:
    {
        activities: [
            {
                name: 'le monde !',
                type: ActivityType.Watching
            }
        ],
        status: 'online'
    }
});

cron.schedule('1 13 * * *', async () => {

    const db = await openDatabase();
    const channel = client.channels.cache.get('1226125403371081738');
    const scoreboard = await db.all('SELECT * FROM messages ORDER BY messageCount DESC LIMIT 50');
    const serverTotal = await db.get('SELECT SUM(messageCount) as total FROM messages');

    const top50Promises = scoreboard.map(async (row, index) => {
        const member = await client.guilds.cache.get('1020405855277023273').members.fetch(row.userId).catch(() => null);
        const user = member ? `<@${member.user.id}>` : 'Utilisateur inconnu';
        return index + 1 === 1 ? `🥇 ${user} **-** ${row.messageCount}` : index + 1 === 2 ? `🥈 ${user} **-** ${row.messageCount}` : index + 1 === 3 ? `🥉 ${user} **-** ${row.messageCount}` : `\`\`${index + 1}\`\` ${user} **-** ${row.messageCount}`;
    });

    const top50 = await Promise.all(top50Promises);

    const scoreEmbed = new EmbedBuilder({
        title: '🏆 | Classement des messages envoyés (OBSOLETE !)',
        description: '**Total du serveur :** ' + serverTotal.total + ' messages\n**Total des participants :** ' + scoreboard.length + ' participants\n\n' + top50.join('\n'),
        color: Colors.Navy
    });
    if (channel) {
        await channel.send({
            embeds: [scoreEmbed]
        })
    } else {
        console.error('Channel not found.');
    }
});

/*
const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationCommands('1211584436634910761'), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);
    */

ApplicationCommandRegistries.setDefaultGuildIds(['1020405855277023273']);

client.login(process.env.BOT_TOKEN);