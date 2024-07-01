const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits, CommandInteraction, EmbedBuilder, Colors } = require('discord.js');

class RulesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'reglement',
            description: 'Permet d\'envoyer le règlement.',
            requiredUserPermissions: [PermissionFlagsBits.Administrator]
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('reglement')
                .setDescription('Permet d\'envoyer le règlement.')
        );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        const member = interaction.member

        const rule1Embed = new EmbedBuilder({
            title: '📜 | **Règlement Heaven**',
            description: `- En restant sur le serveur, vous __aprouvez immédiatement le règlement__ ci-dessous.\n- En cas de non-respect de celui ci, \`\`la modération du serveur se reserve le droit de vous sanctionner\`\` !`,
            color: Colors.DarkBlue,
        })

        const rule2Embed = new EmbedBuilder({
            title: 'Salons de discussion',
            description: `> 1. Sur le serveur, aucune censure n'est appliquée, et nous autorisons le "second degré".\n
            > 2. Les termes de répétitions des messages précédents (quoi-coubeh...) sont prohibés et peuvent conduire au banissement.\n
            > 3. Le spam, flood, spoil ou tout contenu visant à perturber les salons est interdit.\n
            > 4. Le respect d'autrui est primordial, toute forme de harcèlement, discrimination, racisme, homophobie, sexisme, etc. est interdite et sera lourdement sanctionnée.\n
            > 5. Tous les salons ont une utilité bien précise, vous serez donc tenus de les respecter correctement.\n
            > 6. Si vous êtes témoin d'une infraction, merci de contacter un membre du staff.`,
            color: Colors.DarkBlue,
        })

        const rule3Embed = new EmbedBuilder({
            title: 'Salons vocaux',
            description: `> 1. Dans les salons vocaux, tout sons, bruit ou musique visant à nuire les discussions sont interdits.\n
            > 2. Les soundboards ou modificateurs de voix sont interdits.\n
            > 3. Toute forme de discrimination est prohibée.\n
            > 4. Aucun contenu pouvant heurter la sensibilité d'autrui n'est autorisé. **Ceci est d'autant plus vrai en précense d'un.e mineur.e !**`,
            color: Colors.DarkBlue,
        })

        const rule4Embed = new EmbedBuilder({
            title: 'Autres',
            description: `> 1. En cas de divulgation d'informations personnelles (adresses, noms de familles, numéros de téléphones...) peuvent conduire à de lourdes sanctions.\n
            > 2. Les membres du staffs sont bénévoles, ils.elles sont là pour vous aider et maintenir une bonne entente sur le serveur, alors **merci de les respecter !**`,
            color: Colors.DarkBlue,
        })

        const infoEmbed = new EmbedBuilder({
            description: `- Lors d'une infraction au règlement, le staff se réserve le droit de vous appliquer la sanction qui lui convient.\n
            - Merci de récupérer vos rôles dans le salon **"Salons et Rôles"** (tout en haut dans la liste), qui sont \`\`obligatoires\`\` !\n
            - Si vous avez une question, un problème ou une suggestion, merci de mentionner <@&1056394057854750720> !`,
            color: Colors.DarkBlue,
        })

        await interaction.reply({
            content: 'Message envoyé avec succès !',
            ephemeral: true
        });

        await interaction.guild.channels.cache.get('1056394180378767440').send({
            content: '@everyone',
            embeds: [rule1Embed, rule2Embed, rule3Embed, rule4Embed]
        })

        await interaction.guild.channels.cache.get('1056394180378767440').send({
            embeds: [infoEmbed]
        }).then(msg => {
            msg.react('✅')
        })
    }
}
module.exports = {
    RulesCommand
};