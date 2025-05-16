"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_config_1 = require("./config/env.config");
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middlewares/error.middleware");
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const rag_service_1 = require("./services/rag.service");
const ioredis_1 = __importDefault(require("ioredis"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const chat_socket_1 = require("./sockets/chat.socket");
const index_route_1 = __importDefault(require("./routes/index.route"));
class App {
    constructor() {
        this.ragService = new rag_service_1.RAGService();
        this.routes = new index_route_1.default();
        (0, validateEnv_1.default)();
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.port = env_config_1.PORT || 4000;
        this.redisClient = new ioredis_1.default(env_config_1.REDIS_URL || "", {
            reconnectOnError: (err) => {
                console.error("Redis reconnect error:", err);
                return true;
            },
            retryStrategy: (times) => {
                return Math.min(times * 2000, 10000);
            },
        });
        this.redisClient.on("connect", () => {
            console.log("Redis connected successfully.");
        });
        this.redisClient.on("error", (err) => {
            console.error("Redis connection error:", err.message);
        });
        this.initializeMiddlewares();
        this.initializeErrorHandling();
        this.initializeRoutes();
        this.app.use("/", express_1.default.static("public"));
        (0, chat_socket_1.initSocket)(this.io);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`=================================`);
            console.log(`🚀 App listening on the port ${this.port}`);
            console.log(`=================================`);
            this.initializeRAGPipeline();
        });
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json({ limit: "50mb" }));
        this.app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
    }
    async initializeRAGPipeline() {
        console.log("🟡 [RAG] Initializing RAG Pipeline...");
        try {
            await this.ragService.initialize();
            console.log("🟢 [RAG] RAG Pipeline completed successfully.");
        }
        catch (error) {
            console.error("🔴 [RAG] RAG Pipeline failed to initialize:", error);
        }
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.errorMiddleware);
    }
    initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.send("OK");
        });
        this.app.use("/", this.routes.router);
    }
}
exports.default = App;
