"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatHistory_route_1 = __importDefault(require("./chatHistory.route"));
class IndexRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.routes = [
            new chatHistory_route_1.default()
        ];
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes.forEach(route => {
            this.router.use('/', route.router);
        });
    }
}
exports.default = IndexRoute;
