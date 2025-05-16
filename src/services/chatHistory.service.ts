import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ChatHistoryService {
  async getAllUniqueSessionIds(): Promise<any> {
    const sessions = await prisma.chatSession.findMany({
      select:{
        sessionName:true,
        sessionId:true
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return sessions;
  }
  async getSessionHistory(seesionId: string): Promise<any> {
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
