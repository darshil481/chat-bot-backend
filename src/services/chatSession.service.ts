import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ChatSessionService {
  async saveTranscript(
    sessionId: string,
    sessionName: string,
    messages: { query: string; answer: string; createdAt: string }[]
  ) {
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

  async deleteTranscript(sessionId: string) {
    return await prisma.chatMessage.deleteMany({
      where: {
        sessionId,
      },
    });
  }
}
