import express from "express";
import { PORT, REDIS_URL } from "./config/env.config";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import validateEnv from "./utils/validateEnv";
import { RAGService } from "./services/rag.service";
import Redis from "ioredis";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { initSocket } from "./sockets/chat.socket";
import IndexRoute from "./routes/index.route";

class App {
  public app: express.Application;
  public server: http.Server;
  public io: SocketIOServer;
  public port: string | number;
  private ragService = new RAGService();
  private redisClient: Redis;
  private routes = new IndexRoute();

  constructor() {
    validateEnv();
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.port = PORT || 4000;
    this.redisClient = new Redis(REDIS_URL || "", {
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
    this.app.use("/", express.static("public"));

    initSocket(this.io);
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
      this.initializeRAGPipeline();
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
  }

  private async initializeRAGPipeline() {
    console.log("🟡 [RAG] Initializing RAG Pipeline...");
    try {
      await this.ragService.initialize();
      console.log("🟢 [RAG] RAG Pipeline completed successfully.");
    } catch (error) {
      console.error("🔴 [RAG] RAG Pipeline failed to initialize:", error);
    }
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.send("OK");
    });

    this.app.use("/", this.routes.router);
  }
}

export default App;
