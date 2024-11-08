import { schedule } from './data/schedule';
import { botApi } from './utils/botApi';

class LightningBot {
  // We are under the assumption that this function will be called on game day
  public async postGameDayDetails() {
    // Get the current date
    const currentDate = new Date();

    const isTuesday = currentDate.getDay() === 2;
    if (!isTuesday) {
      throw new Error('This function should only be called on Tuesday');
    }

    // Get the current game
    const currentGame = schedule.find((game) => {
      const gameDate = new Date(game.time.dateTime);
      return (
        gameDate.getDate() === currentDate.getDate() &&
        gameDate.getMonth() === currentDate.getMonth()
      );
    });

    if (!currentGame) {
      botApi.postMessage(`No game this week fellas, it's a bye week`);
      return;
    }

    const gameDate = new Date(currentGame.time.dateTime);
    await botApi.postMessage(
      `GAME DAY 🚨 (${gameDate.getMonth()}/${gameDate.getDate()}/${gameDate.getFullYear()})`
    );
    const formattedTime = gameDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    await botApi.postMessage(
      `Summary: ${currentGame.summary}\n` +
        `Location: ${currentGame.location}\n` +
        `Time: ${formattedTime}\n` +
        `Let's get this bread 🍞`
    );
  }
}

export const lightningBot = new LightningBot();
