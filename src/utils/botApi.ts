import axios from 'axios';
import { appConfig } from '../config';

const client = axios.create({
  baseURL: 'https://api.groupme.com/v3',
});

// If there is errors log them
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error in botApi', error);
    return Promise.reject(error);
  }
);

class BotApi {
  token: string = appConfig.API_TOKEN;

  async postMessage(message: string) {
    const data = {
      bot_id: appConfig.BOT_ID,
      text: message,
    };
    await client.post('/bots/post', data);
  }
}

export const botApi = new BotApi();
