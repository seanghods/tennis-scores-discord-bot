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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function fetchTennisScores() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.TENNIS_API_KEY;
        try {
            console.log("fetching");
            const response = yield fetch(`https://api.b365api.com/v3/events/inplay?sport_id=13&token=${token}`);
            console.log("fetched", new Date().toLocaleTimeString());
            const data = yield response.json();
            const matches = [];
            for (const match of data.results) {
                if (match.league.name.split(" ").includes("UTR"))
                    continue;
                const setScore = calculateSetScore(match.scores);
                const matchWinner = calculateMatchWon(setScore, match.scores);
                const { currentSet, currentSetMsg } = calculateCurrentSetScore(match.scores, match.home.name, match.away.name, matchWinner);
                matches.push({
                    id: match.id,
                    fullScore: match.ss,
                    home: match.home.name,
                    away: match.away.name,
                    tournament: match.league.name,
                    scores: match.scores,
                    setScore: setScore,
                    currentSet: currentSet,
                    currentSetMsg: currentSetMsg,
                    matchWinner: matchWinner,
                });
            }
            return matches;
        }
        catch (error) {
            console.error("Error fetching tennis scores:", error);
            return null;
        }
    });
}
exports.default = fetchTennisScores;
function calculateMatchWon(setScore, scores) {
    if (setScore.home == 3 ||
        (setScore.home == 2 && !scores[setScore.home + setScore.away + 1])) {
        return 1;
    }
    else if (setScore.away == 3 ||
        (setScore.away == 2 && !scores[setScore.home + setScore.away + 1])) {
        return 2;
    }
    return 0;
}
function calculateCurrentSetScore(scores, homePlayer, awayPlayer, matchWinner) {
    const currentSetNumber = Object.keys(scores).length;
    const currentSet = {
        home: parseInt(scores[currentSetNumber].home),
        away: parseInt(scores[currentSetNumber].away),
    };
    let currentSetMsg = "";
    if (currentSet.home == currentSet.away) {
        currentSetMsg = `The Game Score is tied at **${currentSet.home}** - **${currentSet.away}**`;
    }
    else if (currentSet.home > currentSet.away) {
        currentSetMsg = `**${homePlayer}** ${matchWinner > 0 ? "won" : "leads"} **${currentSet.home}** - **${currentSet.away}** games to **${awayPlayer}**.`;
    }
    else {
        currentSetMsg = `**${homePlayer}** ${matchWinner > 0 ? "lost" : "is trailing"} **${currentSet.home}** - **${currentSet.away}** games to **${awayPlayer}**.`;
    }
    return { currentSet, currentSetMsg };
}
function calculateSetScore(scores) {
    const setScore = {
        home: 0,
        away: 0,
    };
    for (let i = 1; i <= 5; i++) {
        if (!scores[i]) {
            break;
        }
        const hScore = parseInt(scores[i].home);
        const aScore = parseInt(scores[i].away);
        if (hScore === 7 || (hScore === 6 && aScore <= 4)) {
            setScore.home++;
        }
        else if (aScore === 7 || (aScore === 6 && hScore <= 4)) {
            setScore.away++;
        }
    }
    return setScore;
}
