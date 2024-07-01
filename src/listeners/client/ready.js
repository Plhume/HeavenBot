const { Listener, Events, ApplicationCommandRegistries, container } = require('@sapphire/framework');
const cron = require('node-cron');
const { openDatabase } = require('../../db');
const { openVoiceDatabase } = require('../../voicedb')
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');
const Duration = require('duration');
class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: Events.ClientReady
    });
  }

  async run(client) {
    const { username, id } = client.user;
    this.container.logger.info(`Successfully logged in as ${username} (${id})`);

    cron.schedule('00 12 * * *', async () => {
      const channel = client.guilds.cache.get('1020405855277023273').channels.cache.get('1056394189425889361');
      if (channel) {
        try {
          await sendCron();
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Channel not found.');
      }
    });
  }
}

module.exports = {
  ReadyListener
};

async function sendCron() {
  const vdb = await openVoiceDatabase();
  const db = await openDatabase();
  const client = container.client

  const scoreboard = await db.all('SELECT * FROM messages ORDER BY messageCount DESC LIMIT 50');
  const serverTotal = await db.get('SELECT SUM(messageCount) as total FROM messages');

  const sb2 = await vdb.all('SELECT userId, time FROM voice ORDER BY time DESC LIMIT 50');
  const serverTotal2 = await vdb.get('SELECT SUM(time) as totalTime FROM voice');

  const top50PromisesMsg = scoreboard.map(async (row, index) => {
    const member = await client.guilds.cache.get('1020405855277023273').members.fetch(row.userId).catch(() => null);
    const user = member ? `<@${member.user.id}>` : 'Utilisateur inconnu';
    return index + 1 === 1 ? `🥇 ${user} **-** ${row.messageCount}` : index + 1 === 2 ? `🥈 ${user} **-** ${row.messageCount}` : index + 1 === 3 ? `🥉 ${user} **-** ${row.messageCount}` : `\`\`${index + 1}\`\` ${user} **-** ${row.messageCount}`;
  });

  const top50PromisesVoice = sb2.map(async (row, index) => {
    const time = row.time;
    const duration = new Duration(new Date(Date.now() - time), new Date(Date.now()));
    row.time = duration.toString(1, 2);

    const member = await client.guilds.cache.get('1020405855277023273').members.fetch(row.userId).catch(() => null);
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

  const channel = client.guilds.cache.get('1020405855277023273').channels.cache.get('1056394189425889361');
  channel.send({
    embeds: [scoreEmbed, scoreEmbed2]
  })
}