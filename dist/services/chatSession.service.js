"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ChatSessionService {
    async saveTranscript(sessionId, sessionName, messages) {
        await prisma.chatSession.upsert({
            where: {
                sessionId,
            },
            update: {
                sessionName,
            },
            create: {
                sessionId,
                sessionName,
                transcript: "",
            },
        });
        for (const msg of messages) {
            await prisma.chatMessage.create({
                data: {
                    sessionId,
                    query: msg.query,
                    answer: msg.answer,
                    isStored: true,
                },
            });
        }
    }
    async deleteTranscript(sessionId) {
        return await prisma.chatMessage.deleteMany({
            where: {
                sessionId,
            },
        });
    }
}
exports.ChatSessionService = ChatSessionService;
