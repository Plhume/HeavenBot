const { EmbedBuilder, Colors } = require("discord.js");

function sendDevmodeLog(interaction) {
    const client = interaction.client;
    try {
        const logEmbed = new EmbedBuilder({
            description: '> ❌ Le bot est actuellement en développement, veuillez réessayer plus tard !\n\n- Contactez <@716639931610562563> pour plus d\'informations.',
            timestamp: Date.now(),
            color: Colors.Red,
            footer: {
                text: '© 2024 | Heaven',
                icon_url: client.user.avatarURL()
            }
        })
        interaction.reply({
            embeds: [logEmbed],
            ephemeral: true
        });
    } catch (error) {
        console.error(error);
    }
}

function sendLog(title, desc, color, channel) {
    try {
        const logEmbed = new EmbedBuilder({
            title: title,
            description: desc,
            color: color,
            timestamp: Date.now(),
            footer: {
                text: '© 2024 | Heaven',
                //icon_url: client.user.avatarURL()
            }
        })
        channel.send({
            content: '',
            embeds: [logEmbed]
        });
    } catch (error) {
        console.error(error);
    }
}

/*function sendLog(title, desc, color, fields, channel) {
    for (const field of fields) {
        try {
            const logEmbed = new EmbedBuilder({
                title: title,
                description: desc,
                color: color,
                timestamp: Date.now(),
                fields: [
                    {
                        name: field.name,
                        value: field.value,
                    }
                ],
                footer: {
                    text: '© 2024 | Heaven',
                    //icon_url: client.user.avatarURL()
                }
            })
            channel.send({
                content: '',
                embeds: [logEmbed]
            });
        } catch (error) {
            console.error(error);
        }
    }
}*/

module.exports = {
    sendDevmodeLog,
    sendLog,
}

// THIS IS AN EXAMPLE OF SND LOG FUNCTION

/*const fieldName1 = 'Field1 Names';
const fieldValue1 = 'Field1 Value';

const fieldName2 = 'Field2 Names';
const fieldValue2 = 'Field2 Value';

sendLog('Hello !', 'This is a test', Colors.Red, [{name: fieldName1, value: fieldValue1}, {name: fieldName2, value: fieldValue2}], channel);*/