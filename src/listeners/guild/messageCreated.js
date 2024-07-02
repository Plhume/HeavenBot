const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');
const levelsPath = path.resolve(__dirname, '../../lib/levels.json');
require('dotenv').config();

const getRandomExp = () => Math.floor(Math.random() * 5) + 1;

const getNextLevelExp = (level) => Math.floor(50 * Math.pow(1.5, level - 1));

class MessageUpdated extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.MessageCreate
        });
    }

    async run(message) {
        if (message.author.bot) return;
        const userId = message.author.id;

        if (message.content.includes('discord.gg')) {
            if (message.content.includes('ZWyhqJqWyZ') || message.content.includes('SfQ6AxVrbe')) return;

            const embed = new EmbedBuilder({
                description: `❌ Les liens d'invitation Discord ne sont pas autorisés ici !`,
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

        let levels = {};
        if (fs.existsSync(levelsPath)) {
            try {
                levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8'));
                console.log('Levels file read successfully.');
            } catch (error) {
                console.error('Error reading levels file:', error);
            }
        }

        if (!levels[userId]) {
            levels[userId] = { exp: 0, level: 1 };
        }

        const expToAdd = getRandomExp();
        levels[userId].exp += expToAdd;

        const nextLevelExp = getNextLevelExp(levels[userId].level);
        if (levels[userId].exp >= nextLevelExp) {
            levels[userId].level++;
            levels[userId].exp -= nextLevelExp;

            message.guild.channels.cache.get('1056394189425889361').send(`🎉 Félicitations <@${message.author.id}> ! Tu as atteint le niveau ${levels[userId].level} !`);
        }

        try {
            fs.writeFileSync(levelsPath, JSON.stringify(levels, null, 2), 'utf8');
            console.log('Levels file written successfully.');
        } catch (error) {
            console.error('Error writing to levels file:', error);
        }
    }
}

module.exports = {
    MessageUpdated
};