"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ChatHistoryService {
    async getAllUniqueSessionIds() {
        const sessions = await prisma.chatSession.findMany({
            select: {
                sessionName: true,
                sessionId: true
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return sessions;
    }
    async getSessionHistory(seesionId) {
        const history = await prisma.chatMessage.findMany({
            where: {
                sessionId: seesionId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return history;
    }
}
exports.ChatHistoryService = ChatHistoryService;
