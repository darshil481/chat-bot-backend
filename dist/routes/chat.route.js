"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
class CharRoute {
    constructor() {
        this.path = '/chat';
        this.router = (0, express_1.Router)();
        this.chatController = new chat_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.router.post('/message', this.chatController.sendMessage);
        // this.router.get('/history/:sessionId', this.chatController.getChatHistory);
        // this.router.delete('/history/:sessionId', this.chatController.clearChatHistory);
    }
}
exports.default = CharRoute;
