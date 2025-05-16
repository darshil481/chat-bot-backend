"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryController = void 0;
const common_helper_1 = require("../helpers/common.helper");
class ChatHistoryController {
    constructor(chatHistoryService) {
        this.chatHistoryService = chatHistoryService;
        this.getAllSessions = async (req, res, next) => {
            try {
                const result = await this.chatHistoryService.getAllUniqueSessionIds();
                return (0, common_helper_1.generalResponse)(res, result, "Chat History fetched successfully", "success", false, 200);
            }
            catch (error) {
                console.error(error);
                return (0, common_helper_1.generalResponse)(res, null, "An error occurred while retrieving Chats", "error", true, 500);
            }
        };
        this.getSessionChatHistory = async (req, res, next) => {
            try {
                const { sessionId } = req.body;
                if (!sessionId) {
                    return (0, common_helper_1.generalResponse)(res, null, "Missing required sessionId", "error", true, 400);
                }
                const result = await this.chatHistoryService.getSessionHistory(sessionId);
                return (0, common_helper_1.generalResponse)(res, result, "Chat History fetched successfully", "success", false, 200);
            }
            catch (error) {
                console.error(error);
                return (0, common_helper_1.generalResponse)(res, null, "An error occurred while retrieving Chats", "error", true, 500);
            }
        };
    }
}
exports.ChatHistoryController = ChatHistoryController;
