import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || '');

export class ChatService {
  async storeMessage(sessionId: string, message: { query: string; answer?: string;createdAt?:string }): Promise<void> {
    const fullMessage = { ...message, isStored: false }; 
    await redisClient.rpush(`chat_history:${sessionId}`, JSON.stringify(fullMessage));
  }

  async getHistory(sessionId: string): Promise<any[]> {
    const raw = await redisClient.lrange(`chat_history:${sessionId}`, 0, -1);
    return raw
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  async getUnstoredMessages(sessionId: string): Promise<any[]> {
    const history = await this.getHistory(sessionId);
    return history.filter((msg) => !msg.isStored);
  }

async markMessagesAsStored(sessionId: string): Promise<void> {
  const allMessages = await this.getHistory(sessionId);

  const updated = allMessages.map((msg: any) => ({
    ...msg,
    isStored: true,
  }));

  await redisClient.del(`chat_history:${sessionId}`);
  await redisClient.rpush(
    `chat_history:${sessionId}`,
    ...updated.map((msg) => JSON.stringify(msg))
  );
}


  async deleteHistory(sessionId: string): Promise<void> {
    await redisClient.del(`chat_history:${sessionId}`);
    console.log(`Hard deleted history for session ${sessionId}`);
  }

  async clearHistory(sessionId: string): Promise<void> {
    await redisClient.set(`chat_cleared:${sessionId}`, 'true');
  }
}
