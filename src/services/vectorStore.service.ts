import { QdrantClient } from '@qdrant/js-client-rest';
import { QDRANT_COLLECTION, QDRANT_HOST, QDRANT_API_KEY } from '../config/env.config';
import { v4 as uuidv4 } from 'uuid';

interface DocumentPayload {
  id?: string;
  title?: string;
  content?: string;
  fullContent?: string;
  link?: string;
  date?: string;
}

export class QdrantService {
  private client: QdrantClient;
  private collectionName: string;

  constructor() {
    this.client = new QdrantClient({
      url: QDRANT_HOST, 
      apiKey: QDRANT_API_KEY, 
    });
    this.collectionName = QDRANT_COLLECTION || 'news_embeddings'; 
  }

  public async initCollection(vectorSize: number) {
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
    } else {
      console.log(`Collection "${this.collectionName}" already exists.`);
    }
  }

  public async insertDocuments(embeddings: number[][], payloads: DocumentPayload[]) {
    if (embeddings.length !== payloads.length) {
      throw new Error('Mismatch between embeddings and payloads count.');
    }

    const points = embeddings.map((vector, idx) => ({
      id: uuidv4(),
      vector,
      payload: this.cleanPayload(payloads[idx]),
    }));

    await this.client.upsert(this.collectionName, { points });
    console.log(`Inserted ${points.length} vectors into Qdrant.`);
  }

  private cleanPayload(payload: DocumentPayload): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  public async search(queryVector: number[], topK: number = 5) {
    const result = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit: topK,
    });

    return result;
  }
}
