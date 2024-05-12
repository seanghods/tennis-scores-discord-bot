import {
  Client,
  Events,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
} from 'discord.js';
import dotenv from 'dotenv';
import fetchTennisScores, { TennisMatch } from './tennis';
dotenv.config();

let lastScores = new Map();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, async () => {
  console.log(`Ready! Logged in as ${client.user?.tag}`);
  setInterval(checkScoresAndNotify, 30000);
});

client.login(process.env.DISCORD_KEY);

async function checkScoresAndNotify() {
  const matches = await fetchTennisScores();
  const channel = (await client.channels.fetch(
    '1239018474437873674'
  )) as TextChannel;

  if (!matches) {
    return console.log('Error fetching tennis scores or No Matches');
  }

  matches.forEach((match: TennisMatch) => {
    const matchId = match.id;
    const oldScore = lastScores.get(matchId);
    const currentMatchData = {
      fullScore: match.fullScore,
      scores: match.scores,
      setScore: match.setScore,
      currentSet: match.currentSet,
      currentSetMsg: match.currentSetMsg,
      matchWinner: match.matchWinner,
    };
    if (!oldScore || oldScore.fullScore !== match.fullScore) {
      if (oldScore) {
        const old = lastScores.get(matchId).fullScore.split(',');
        const curr = match.fullScore.split(',');
        const scores = [old, curr];
        for (const each of scores) {
          for (let e of each) {
            e = e.split('-');
          }
        }
        console.log(scores);
      }
      lastScores.set(matchId, currentMatchData);
      if (!oldScore) return;
      const gameMsg = calculateGameMsg(oldScore, match);
      const embed = new EmbedBuilder()
        .setTitle(`${match.home} vs ${match.away}`)
        .setDescription(
          `${gameMsg}\n` +
            `${match.currentSetMsg}\n` +
            `The Set Score is **${match.setScore.home}** - **${match.setScore.away}**\n` +
            `**${match.tournament}**`
          // "[View Full Match](http://example.com)"
        )
        .setFields({
          name: ' ',
          value: '**Powered By [TennisXData](https://www.tennisxdata.app)**',
          inline: true,
        })
        .setColor('#0099ff');
      // .setFooter({
      //   text: "Powered By TennisXData",
      // });

      channel.send({ embeds: [embed] });
    }
  });
}

function calculateGameMsg(oldScore: TennisMatch, match: TennisMatch) {
  if (
    oldScore.fullScore === match.fullScore ||
    (oldScore.setScore.home == 0 &&
      oldScore.setScore.away == 0 &&
      oldScore.currentSet.home == 0 &&
      oldScore.currentSet.away == 0)
  ) {
    return '';
  }
  if (match.matchWinner == 1) {
    return `**${match.home}** won the match`;
  } else if (match.matchWinner == 2) {
    return `**${match.away}** won the match`;
  } else if (
    match.setScore.home == 0 &&
    match.setScore.away == 0 &&
    match.currentSet.home == 0 &&
    match.currentSet.away == 0
  ) {
    return `The match has started`;
  } else if (oldScore.setScore.home !== match.setScore.home) {
    return `**${match.home}** won the set`;
  } else if (oldScore.setScore.away !== match.setScore.away) {
    return `**${match.away}** won the set`;
  } else if (oldScore.currentSet.home !== match.currentSet.home) {
    return `**${match.home}** won the game`;
  } else if (oldScore.currentSet.away !== match.currentSet.away) {
    return `**${match.away}** won the game`;
  }
}
