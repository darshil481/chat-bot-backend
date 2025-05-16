"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const chat_service_1 = require("../services/chat.service");
const ragQuery_service_1 = require("../services/ragQuery.service");
const chatSession_service_1 = require("../services/chatSession.service");
const initSocket = (io) => {
    const chatService = new chat_service_1.ChatService();
    const chatSessionService = new chatSession_service_1.ChatSessionService();
    const ragQueryService = new ragQuery_service_1.RAGQueryService();
    io.on("connection", (socket) => {
        console.log(`New connection: ${socket.id}`);
        socket.on("chat:join", async (sessionId) => {
            socket.join(sessionId);
            await chatService.deleteHistory(sessionId);
            console.log(`Joined session: ${sessionId}`);
        });
        socket.on("chat:message", async ({ sessionId, query }) => {
            if (!sessionId || !query)
                return;
            const answer = await ragQueryService.getAnswer(query);
            const message = {
                query,
                answer,
                createdAt: new Date().toISOString(),
            };
            await chatService.storeMessage(sessionId, message);
            io.to(sessionId).emit("chat:message", {
                sessionId,
                message: { ...message, isStored: false },
            });
        });
        socket.on("chat:history", async (sessionId) => {
            const history = await chatService.getHistory(sessionId);
            io.to(sessionId).emit("chat:history", { sessionId, history });
        });
        socket.on("chat:clear", async (sessionId) => {
            await chatSessionService.deleteTranscript(sessionId);
            await chatService.deleteHistory(sessionId);
            io.to(sessionId).emit("chat:cleared");
        });
        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
        socket.on("chat:leave", (sessionId) => {
            socket.leave(sessionId);
            console.log(`Left session: ${sessionId}`);
        });
        socket.on("chat:end", async (sessionId, sessionName, callback) => {
            try {
                const unstoredMessages = await chatService.getUnstoredMessages(sessionId);
                if (unstoredMessages.length === 0) {
                    console.log(`No new messages to store for session ${sessionId}`);
                    callback({ success: true });
                    return;
                }
                const messagesToStore = unstoredMessages.map((chat) => ({
                    query: chat.query,
                    answer: chat.answer,
                    createdAt: chat.createdAt,
                }));
                await chatSessionService.saveTranscript(sessionId, sessionName, messagesToStore);
                await chatService.markMessagesAsStored(sessionId);
                console.log(`Stored transcript for session: ${sessionId}`);
                callback({ success: true });
            }
            catch (error) {
                console.error(`Failed to store transcript for session: ${sessionId}`, error);
                callback({ success: false, error: error.message || "Unknown error" });
            }
        });
    });
};
exports.initSocket = initSocket;
