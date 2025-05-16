"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const chatHistory_service_1 = require("../services/chatHistory.service");
const chatHistory_controller_1 = require("../controllers/chatHistory.controller");
const upload = (0, multer_1.default)();
class ChatHistoryRoute {
    constructor() {
        this.path = '/history';
        this.router = (0, express_1.Router)();
        this.chatHistoryController = new chatHistory_controller_1.ChatHistoryController(new chatHistory_service_1.ChatHistoryService());
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/get-all-session`, upload.none(), this.chatHistoryController.getAllSessions);
        this.router.post(`${this.path}/get-seesion-history`, upload.none(), this.chatHistoryController.getSessionChatHistory);
    }
}
exports.default = ChatHistoryRoute;
