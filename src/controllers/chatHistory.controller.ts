import { Request, Response, NextFunction } from "express";
import { generalResponse } from "../helpers/common.helper";
import { ChatHistoryService } from "../services/chatHistory.service";
export class ChatHistoryController {
  constructor(private chatHistoryService: ChatHistoryService) {}

  public getAllSessions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.chatHistoryService.getAllUniqueSessionIds();
      return generalResponse(
        res,
        result,
        "Chat History fetched successfully",
        "success",
        false,
        200
      );
    } catch (error) {
      console.error(error);
      return generalResponse(
        res,
        null,
        "An error occurred while retrieving Chats",
        "error",
        true,
        500
      );
    }
  };
  public getSessionChatHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return generalResponse(
          res,
          null,
          "Missing required sessionId",
          "error",
          true,
          400
        );
      }
      const result = await this.chatHistoryService.getSessionHistory(sessionId);
      return generalResponse(
        res,
        result,
        "Chat History fetched successfully",
        "success",
        false,
        200
      );
    } catch (error) {
      console.error(error);
      return generalResponse(
        res,
        null,
        "An error occurred while retrieving Chats",
        "error",
        true,
        500
      );
    }
  };
}
