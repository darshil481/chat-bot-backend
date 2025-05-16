"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedderService = void 0;
const axios_1 = __importDefault(require("axios"));
class EmbedderService {
    constructor() {
        this.JINA_API_URL = process.env.JINA_API_URL || 'https://api.jina.ai/v1/embeddings';
        this.JINA_API_KEY = process.env.JINA_API_KEY || '';
    }
    async embedTexts(texts) {
        try {
            const response = await axios_1.default.post(this.JINA_API_URL, {
                input: texts,
                model: 'jina-embeddings-v2-base-en',
            }, {
                headers: {
                    Authorization: `Bearer ${this.JINA_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data.map((item) => item.embedding);
        }
        catch (error) {
            throw new Error('Embedding failed');
        }
    }
}
exports.EmbedderService = EmbedderService;
