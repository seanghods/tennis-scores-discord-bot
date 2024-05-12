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
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
function fetchTennisScores() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.TENNIS_API_KEY;
        try {
            console.log("fetching");
            const response = yield fetch(`https://api.b365api.com/v3/events/inplay?sport_id=13&token=${token}`);
            console.log("fetched");
            const data = yield response.json();
            yield fs_1.default.promises.writeFile("tennis.json", JSON.stringify(data, null, 2));
        }
        catch (error) {
            console.error("Error fetching tennis scores:", error);
            return null;
        }
    });
}
fetchTennisScores();
