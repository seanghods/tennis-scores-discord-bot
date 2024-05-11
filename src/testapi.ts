import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

async function fetchTennisScores() {
  const token = process.env.TENNIS_API_KEY;
  try {
    console.log("fetching");
    const response = await fetch(
      `https://api.b365api.com/v3/events/inplay?sport_id=13&token=${token}`
    );
    console.log("fetched");
    const data = await response.json();
    await fs.promises.writeFile("tennis.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching tennis scores:", error);
    return null;
  }
}

fetchTennisScores();
