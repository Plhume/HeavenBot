const { Command } = require('@sapphire/framework');
const {
    PermissionFlagsBits,
    CommandInteraction,
    EmbedBuilder,
    Colors
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const lockStatusPath = path.resolve(__dirname, '../../lib/lockStatus.json');
require('dotenv').config();

class LockCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'lock',
            description: 'Permet de verrouiller ou déverrouiller le salon actuel.',
            requiredUserPermissions: [PermissionFlagsBits.Administrator]
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('lock')
                .setDescription('Permet de verrouiller ou déverrouiller le salon actuel.')
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const channelId = interaction.channel.id;

        let lockStatus = {};
        if (fs.existsSync(lockStatusPath)) {
            lockStatus = JSON.parse(fs.readFileSync(lockStatusPath, 'utf8'));
        }

        const currentStatus = lockStatus[channelId] ?? false;
        const newStatus = !currentStatus;

        lockStatus[channelId] = newStatus;
        fs.writeFileSync(lockStatusPath, JSON.stringify(lockStatus, null, 2), 'utf8');

        const embed = new EmbedBuilder()
            .setTitle('🔒 | Statut du salon')
            .setDescription(`Le salon vient d'être ${newStatus ? 'verrouillé' : 'déverrouillé'} par <@${interaction.user.id}> !`)
            .setColor(newStatus ? Colors.Red : Colors.Green)
            .setTimestamp(Date.now())
            .setFooter({
                text: '© 2024 | Heaven',
                iconURL: this.container.client.user.avatarURL()
            });

        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            [PermissionFlagsBits.SendMessages]: newStatus ? false : true
        });

        await interaction.channel.send({
            embeds: [embed]
        });

        await interaction.reply({
            content: `Le salon a bien été ${newStatus ? 'verrouillé' : 'déverrouillé'} par <@${interaction.user.id}> !`,
            ephemeral: true
        });

        const logEmbed = new EmbedBuilder({
            title: 'Statut du salon > logs',
            description: `Le salon <#${interaction.channel.id}> a été ${newStatus ? '**verrouillé**' : '**déverrouillé**'} par <@${interaction.user.id}> !`,
            color: Colors.Aqua,
            timestamp: Date.now(),
            footer: {
                text: '© 2024 | Heaven',
                icon_url: this.container.client.user.avatarURL()
            }
        });

        await this.container.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL).send({
            embeds: [logEmbed]
        });
    }
}

module.exports = {
    LockCommand
};