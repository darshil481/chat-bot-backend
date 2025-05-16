import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT,
    LIMIT,
    FEED_URL,
    QDRANT_HOST,
    QDRANT_API_KEY,
    JINA_API_URL,
    QDRANT_COLLECTION,
    JINA_API_KEY,
    GEMINI_API_KEY,
    GEMINI_API_URL,
    JINA_EMBED_URL,
    REDIS_URL
  } = process.env;
  