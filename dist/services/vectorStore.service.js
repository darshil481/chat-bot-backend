"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantService = void 0;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const env_config_1 = require("../config/env.config");
const uuid_1 = require("uuid");
class QdrantService {
    constructor() {
        this.client = new js_client_rest_1.QdrantClient({
            url: env_config_1.QDRANT_HOST,
            apiKey: env_config_1.QDRANT_API_KEY,
        });
        this.collectionName = env_config_1.QDRANT_COLLECTION || 'news_embeddings';
    }
    async initCollection(vectorSize) {
        console.log(`Initializing Qdrant collection: ${this.collectionName}...`);
        const collections = await this.client.getCollections();
        const exists = collections.collections.find(c => c.name === this.collectionName);
        if (!exists) {
            await this.client.createCollection(this.collectionName, {
                vectors: {
                    size: vectorSize,
                    distance: 'Cosine',
                },
            });
            console.log(`Created new Qdrant collection: ${this.collectionName}`);
        }
        else {
            console.log(`Collection "${this.collectionName}" already exists.`);
        }
    }
    async insertDocuments(embeddings, payloads) {
        if (embeddings.length !== payloads.length) {
            throw new Error('Mismatch between embeddings and payloads count.');
        }
        const points = embeddings.map((vector, idx) => ({
            id: (0, uuid_1.v4)(),
            vector,
            payload: this.cleanPayload(payloads[idx]),
        }));
        await this.client.upsert(this.collectionName, { points });
        console.log(`Inserted ${points.length} vectors into Qdrant.`);
    }
    cleanPayload(payload) {
        const cleaned = {};
        for (const [key, value] of Object.entries(payload)) {
            if (value !== undefined) {
                cleaned[key] = value;
            }
        }
        return cleaned;
    }
    async search(queryVector, topK = 5) {
        const result = await this.client.search(this.collectionName, {
            vector: queryVector,
            limit: topK,
        });
        return result;
    }
}
exports.QdrantService = QdrantService;
