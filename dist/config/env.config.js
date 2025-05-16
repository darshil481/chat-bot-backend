"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_URL = exports.JINA_EMBED_URL = exports.GEMINI_API_URL = exports.GEMINI_API_KEY = exports.JINA_API_KEY = exports.QDRANT_COLLECTION = exports.JINA_API_URL = exports.QDRANT_API_KEY = exports.QDRANT_HOST = exports.FEED_URL = exports.LIMIT = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
_a = process.env, exports.PORT = _a.PORT, exports.LIMIT = _a.LIMIT, exports.FEED_URL = _a.FEED_URL, exports.QDRANT_HOST = _a.QDRANT_HOST, exports.QDRANT_API_KEY = _a.QDRANT_API_KEY, exports.JINA_API_URL = _a.JINA_API_URL, exports.QDRANT_COLLECTION = _a.QDRANT_COLLECTION, exports.JINA_API_KEY = _a.JINA_API_KEY, exports.GEMINI_API_KEY = _a.GEMINI_API_KEY, exports.GEMINI_API_URL = _a.GEMINI_API_URL, exports.JINA_EMBED_URL = _a.JINA_EMBED_URL, exports.REDIS_URL = _a.REDIS_URL;
