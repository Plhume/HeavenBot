const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
require('dotenv').config();
const { openDatabase } = require('../../db')

class MessageUpdated extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.MessageCreate
        });
    }

    async run(message) {
        if (message.author.bot) return;
        const db = await openDatabase();
        const userId = message.author.id;

        await db.run(`
            INSERT INTO messages (userId, messageCount)
            VALUES (?, 1)
            ON CONFLICT(userId) DO UPDATE SET messageCount = messageCount + 1
        `, [userId]);

        // Récupérer le nombre de messages de l'utilisateur
        const userRow = await db.get('SELECT * FROM messages WHERE userId = ?', [userId]);

        if (message.content.includes('discord.gg')) {
            if (message.content.includes('Zfe4MBNsHK')) return;

            const embed = new EmbedBuilder({
                description: `❌ Les liens d'inviration Discord ne sont pas autorisés ici !`,
                color: Colors.Red,
            });
            message.delete();
            message.channel.send({
                content: `<@${message.author.id}>`,
                embeds: [embed]
            });

            const logEmbed = new EmbedBuilder({
                title: '❌ | Liens envoyé > logs',
                description: `<@${message.author.id}> a tenté d'envoyer un lien d'invitation dans <#${message.channelId}>.`,
                color: Colors.Grey,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'Message',
                        value: message.content || '❌ Message invalide',
                        inline: true
                    }
                ],
                footer: {
                    text: '© 2024 | Heaven',
                    icon_url: client.user.avatarURL()
                }
            });

            client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
                content: ``,
                embeds: [logEmbed]
            });
        }
    }
}
module.exports = {
    MessageUpdated
};