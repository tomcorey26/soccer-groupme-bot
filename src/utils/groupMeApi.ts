import axios from 'axios';
import { appConfig } from '../config';

const client = axios.create({
  baseURL: 'https://api.groupme.com/v3',
});

class GroupMeApi {
  token: string = appConfig.API_TOKEN;

  async sendMessage(message: string) {
    const data = {
      bot_id: appConfig.BOT_ID,
      text: message,
    };
    await client.post('/bots/post', data);
  }
}

export const groupMeApi = new GroupMeApi();
