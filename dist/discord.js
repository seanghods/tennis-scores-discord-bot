"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const tennis_1 = __importDefault(require("./tennis"));
dotenv_1.default.config();
let lastScores = new Map();
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
});
client.once(discord_js_1.Events.ClientReady, () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`Ready! Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    setInterval(checkScoresAndNotify, 30000);
}));
client.login(process.env.DISCORD_KEY);
function checkScoresAndNotify() {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = yield (0, tennis_1.default)();
        const channel = (yield client.channels.fetch("1232716870478462990"));
        if (!matches) {
            return console.log("Error fetching tennis scores or No Matches");
        }
        matches.forEach((match) => {
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
                    const old = lastScores.get(matchId).fullScore.split(",");
                    const curr = match.fullScore.split(",");
                    const scores = [old, curr];
                    for (const each of scores) {
                        for (let e of each) {
                            e = e.split("-");
                        }
                    }
                    console.log(scores);
                }
                lastScores.set(matchId, currentMatchData);
                if (!oldScore)
                    return;
                const gameMsg = calculateGameMsg(oldScore, match);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`${match.home} vs ${match.away}`)
                    .setDescription(`${gameMsg}\n` +
                    `${match.currentSetMsg}\n` +
                    `The Set Score is **${match.setScore.home}** - **${match.setScore.away}**\n` +
                    `**${match.tournament}**`
                // "[View Full Match](http://example.com)"
                )
                    .setFields({
                    name: " ",
                    value: "**Powered By [TennisXData](https://www.tennisxdata.app)**",
                    inline: true,
                })
                    .setColor("#0099ff");
                // .setFooter({
                //   text: "Powered By TennisXData",
                // });
                channel.send({ embeds: [embed] });
            }
        });
    });
}
function calculateGameMsg(oldScore, match) {
    if (oldScore.fullScore === match.fullScore ||
        (oldScore.setScore.home == 0 &&
            oldScore.setScore.away == 0 &&
            oldScore.currentSet.home == 0 &&
            oldScore.currentSet.away == 0)) {
        return "";
    }
    if (match.matchWinner == 1) {
        return `**${match.home}** won the match`;
    }
    else if (match.matchWinner == 2) {
        return `**${match.away}** won the match`;
    }
    else if (match.setScore.home == 0 &&
        match.setScore.away == 0 &&
        match.currentSet.home == 0 &&
        match.currentSet.away == 0) {
        return `The match has started`;
    }
    else if (oldScore.setScore.home !== match.setScore.home) {
        return `**${match.home}** won the set`;
    }
    else if (oldScore.setScore.away !== match.setScore.away) {
        return `**${match.away}** won the set`;
    }
    else if (oldScore.currentSet.home !== match.currentSet.home) {
        return `**${match.home}** won the game`;
    }
    else if (oldScore.currentSet.away !== match.currentSet.away) {
        return `**${match.away}** won the game`;
    }
}
