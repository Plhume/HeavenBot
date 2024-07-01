const { Listener, Events } = require('@sapphire/framework');
const { EmbedBuilder, Colors, VoiceState } = require('discord.js');
require('dotenv').config();
const { openVoiceDatabase } = require('../../voicedb')
const Duration = require('duration');

class InteractionCreate extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.VoiceStateUpdate
        });
    }

    async run(oldState, newState) {
        if (oldState.channelId === null && newState.channelId !== null) {
            this.handleVoiceJoin(newState);
            const embed = new EmbedBuilder({
                title: '🔊 | Connexion à un salon vocal',
                description: `<@${newState.member.id}> vient de se connecter au salon vocal <#${newState.channelId}>`,
                color: Colors.DarkGreen,
                timestamp: Date.now(),
                footer: {
                    text: '© 2024 | Heaven',
                    icon_url: this.container.client.user.avatarURL()
                }
            });

            this.container.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
                content: ``,
                embeds: [embed]
            });
        } else if (oldState.channelId !== null && newState.channelId === null) {
            this.handleVoiceLeave(oldState);
            const embed = new EmbedBuilder({
                title: '🔇 | Déconnexion d\'un salon vocal',
                description: `<@${oldState.member.id}> vient de se déconnecter du salon vocal <#${oldState.channelId}>`,
                color: Colors.DarkGreen,
                timestamp: Date.now(),
                footer: {
                    text: '© 2024 | Heaven',
                    icon_url: this.container.client.user.avatarURL()
                }
            });

            this.container.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
                content: ``,
                embeds: [embed]
            });
        }
    }

    async handleVoiceJoin(newState) {
        newState.member.voice.startTime = Date.now();
    }

    async handleVoiceLeave(oldState) {
        const startTime = oldState.member.voice.startTime;
        if (startTime) {
            const endTime = Date.now();
            const timeSpent = endTime - startTime;

            await this.updateTimeSpent(oldState.member.id, timeSpent);
        }
    }

    async updateTimeSpent(userId, time) {
        const db = await openVoiceDatabase();
        await db.run(`INSERT INTO voice (userId, time) 
        VALUES (?, ${time}) 
        ON CONFLICT(userId) DO UPDATE SET time = time + ${time}
        `, [userId]);
        console.log(time)
    }
}

module.exports = {
    InteractionCreate
};