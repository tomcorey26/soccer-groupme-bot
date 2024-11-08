import { appConfig } from '../config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.groupme.com/v3',
});

// If there is errors log them
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.response && console.error(error.response.data);
    return Promise.reject(error);
  }
);

class BotApi {
  async postMessage(message: string) {
    const data = {
      bot_id: appConfig.BOT_ID,
      text: message,
    };
    return apiClient.post('/bots/post', data);
  }
}

class PollApi {
  async createPoll(data: {
    subject: string;
    options: { title: string }[];
    expiration: number;
    type: 'single' | 'multi';
    visibility: 'public' | 'anonymous';
  }) {
    const params = {
      token: appConfig.API_TOKEN,
    };
    return apiClient.post(`/poll/${appConfig.GROUP_ID}`, data, { params });
  }
}

export const groupmeApi = {
  bots: new BotApi(),
  polls: new PollApi(),
};
