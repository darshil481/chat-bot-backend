"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGQueryService = void 0;
const vectorStore_service_1 = require("./vectorStore.service");
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../config/env.config");
class RAGQueryService {
    constructor() {
        this.qdrantService = new vectorStore_service_1.QdrantService();
    }
    async embedQuery(query) {
        const response = await axios_1.default.post(env_config_1.JINA_EMBED_URL || 'https://api.jina.ai/v1/embeddings', {
            input: [query],
            model: 'jina-embeddings-v2-base-en',
        }, {
            headers: {
                Authorization: `Bearer ${env_config_1.JINA_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data[0].embedding;
    }
    async retrieveTopKPassages(queryEmbedding, topK = 5) {
        const results = await this.qdrantService.search(queryEmbedding, 5);
        return results.map(r => {
            const payload = r.payload;
            return payload.fullContent || payload.content || '';
        });
    }
    async callGemini(contexts, query) {
        console.log("================>", contexts);
        const cleanedContext = contexts
            .map(context => context.replace(/[\*\-#\d]/g, '').trim())
            .join('\n\n---\n\n');
        const prompt = `You are an assistant. Use only the following context to answer:\n\n${cleanedContext}\n\nQuestion: ${query}`;
        const response = await axios_1.default.post(`${env_config_1.GEMINI_API_URL}?key=${env_config_1.GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return (response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Gemini API did not return a valid response.');
    }
    async getAnswer(query) {
        const queryEmbedding = await this.embedQuery(query);
        const topPassages = await this.retrieveTopKPassages(queryEmbedding);
        const finalAnswer = await this.callGemini(topPassages, query);
        return finalAnswer;
    }
}
exports.RAGQueryService = RAGQueryService;
