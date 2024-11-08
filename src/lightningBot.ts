import { appConfig } from './config';
import { schedule } from './data/schedule';
import { groupmeApi } from './utils/groupMeApi';

class LightningBot {
  // We are under the assumption that this function will be called on game day
  public async postGameDayDetails() {
    // Get the current date
    const currentDate = new Date();

    if (appConfig.TEST_MODE) {
      // set date to next Tuesday
      currentDate.setDate(
        currentDate.getDate() + ((2 + 7 - currentDate.getDay()) % 7)
      );
    }

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
      groupmeApi.messages.postMessage(`No game this week fellas, bye week`);
      return;
    }

    const gameDate = new Date(currentGame.time.dateTime);
    const formattedTime = gameDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const res = await groupmeApi.messages.postMessage(
      `GAME DAY 🚨 (${gameDate.getMonth()}/${gameDate.getDate()}/${gameDate.getFullYear()})\n` +
        `Summary: ${currentGame.summary}\n` +
        `Location: ${currentGame.location}\n` +
        `Time: ${formattedTime}\n` +
        `Let's get this bread 🍞`
    );

    // Check if any pinned messages exist and unpin them
    const pinnedMessages = await groupmeApi.pins.listPinnedMessages();
    if (pinnedMessages.data.response.messages.length > 0) {
      for (const message of pinnedMessages.data.response.messages) {
        await groupmeApi.pins.unpinMessage(message.id);
      }
    }

    // Pin the message
    const gameSummaryMessageId = res.data.response.message.id;
    await groupmeApi.pins.pinMessage(gameSummaryMessageId);

    // Create a poll for the game, expires at end of the day
    await groupmeApi.polls.createPoll({
      subject: `Game Tonight at ${formattedTime}, you going?`,
      options: [{ title: 'Yes' }, { title: 'No' }],
      expiration: Math.floor(
        new Date(currentDate.setHours(23, 59, 59, 999)).getTime() / 1000
      ),
      type: 'single',
      visibility: 'public',
    });
  }
}

export const lightningBot = new LightningBot();
