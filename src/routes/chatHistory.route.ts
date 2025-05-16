
import { Routes } from "./index.route";
import { Router } from 'express';
import multer from "multer";
import { ChatHistoryService } from "../services/chatHistory.service";
import { ChatHistoryController } from "../controllers/chatHistory.controller";

const upload = multer();
class ChatHistoryRoute implements Routes {
  public path = '/history';
  public router = Router();
  public chatHistoryController = new ChatHistoryController(new ChatHistoryService());
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/get-all-session`,
      upload.none(),
      this.chatHistoryController.getAllSessions
    );
    this.router.post(
      `${this.path}/get-seesion-history`,
      upload.none(),
      this.chatHistoryController.getSessionChatHistory
    );
  }
  
}


export default ChatHistoryRoute;