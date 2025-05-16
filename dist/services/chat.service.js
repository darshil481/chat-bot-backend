"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default(process.env.REDIS_URL || '');
class ChatService {
    async storeMessage(sessionId, message) {
        const fullMessage = { ...message, isStored: false };
        await redisClient.rpush(`chat_history:${sessionId}`, JSON.stringify(fullMessage));
    }
    async getHistory(sessionId) {
        const raw = await redisClient.lrange(`chat_history:${sessionId}`, 0, -1);
        return raw
            .map((item) => {
            try {
                return JSON.parse(item);
            }
            catch {
                return null;
            }
        })
            .filter(Boolean);
    }
    async getUnstoredMessages(sessionId) {
        const history = await this.getHistory(sessionId);
        return history.filter((msg) => !msg.isStored);
    }
    async markMessagesAsStored(sessionId) {
        const allMessages = await this.getHistory(sessionId);
        const updated = allMessages.map((msg) => ({
            ...msg,
            isStored: true,
        }));
        await redisClient.del(`chat_history:${sessionId}`);
        await redisClient.rpush(`chat_history:${sessionId}`, ...updated.map((msg) => JSON.stringify(msg)));
    }
    async deleteHistory(sessionId) {
        await redisClient.del(`chat_history:${sessionId}`);
        console.log(`Hard deleted history for session ${sessionId}`);
    }
    async clearHistory(sessionId) {
        await redisClient.set(`chat_cleared:${sessionId}`, 'true');
    }
}
exports.ChatService = ChatService;
