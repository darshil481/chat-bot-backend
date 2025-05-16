import { Server } from "socket.io";
import { ChatService } from "../services/chat.service";
import { RAGQueryService } from "../services/ragQuery.service";
import { ChatSessionService } from "../services/chatSession.service";

export const initSocket = (io: Server): void => {
  const chatService = new ChatService();
  const chatSessionService = new ChatSessionService();
  const ragQueryService = new RAGQueryService();

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("chat:join",async (sessionId: string) => {
      socket.join(sessionId);
      await chatService.deleteHistory(sessionId);
      console.log(`Joined session: ${sessionId}`);
    });

    socket.on("chat:message", async ({ sessionId, query }) => {
      if (!sessionId || !query) return;

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

    socket.on("chat:history", async (sessionId: string) => {
      const history = await chatService.getHistory(sessionId);
      io.to(sessionId).emit("chat:history", { sessionId, history });
    });

    socket.on("chat:clear", async (sessionId: string) => {
      await chatSessionService.deleteTranscript(sessionId);
      await chatService.deleteHistory(sessionId);
      io.to(sessionId).emit("chat:cleared");
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
    socket.on("chat:leave", (sessionId: string) => {
      socket.leave(sessionId);
      console.log(`Left session: ${sessionId}`);
    });

   socket.on(
  "chat:end",
  async (
    sessionId: string,
    sessionName: string,
    callback: (response: { success: boolean; error?: string }) => void
  ) => {
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
    } catch (error:any) {
      console.error(`Failed to store transcript for session: ${sessionId}`, error);
      callback({ success: false, error: error.message || "Unknown error" });
    }
  }
);

  });
};
