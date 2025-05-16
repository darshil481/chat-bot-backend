import { QdrantService } from './vectorStore.service';
import axios from 'axios';
import { JINA_API_KEY, GEMINI_API_KEY, JINA_EMBED_URL, GEMINI_API_URL } from '../config/env.config';

export class RAGQueryService {
  private qdrantService: QdrantService;

  constructor() {
    this.qdrantService = new QdrantService();
  }

  private async embedQuery(query: string): Promise<number[]> {
    const response = await axios.post(
      JINA_EMBED_URL || 'https://api.jina.ai/v1/embeddings',
      {
        input: [query],
        model: 'jina-embeddings-v2-base-en',
      },
      {
        headers: {
          Authorization: `Bearer ${JINA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].embedding;
  }

  private async retrieveTopKPassages(queryEmbedding: number[], topK: number = 5): Promise<string[]> {
    const results = await this.qdrantService.search(queryEmbedding, 5);
    return results.map(r => {
      const payload = r.payload as any;
      return payload.fullContent || payload.content || '';
    });
  }

 public async callGemini(contexts: string[], query: string): Promise<string> {
  console.log("================>",contexts)
  const cleanedContext = contexts
    .map(context => context.replace(/[\*\-#\d]/g, '').trim()) 
    .join('\n\n---\n\n');  

  const prompt = `You are an assistant. Use only the following context to answer:\n\n${cleanedContext}\n\nQuestion: ${query}`;

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Gemini API did not return a valid response.'
  );
}


  public async getAnswer(query: string): Promise<string> {
    const queryEmbedding = await this.embedQuery(query);
    const topPassages = await this.retrieveTopKPassages(queryEmbedding);
    const finalAnswer = await this.callGemini(topPassages, query);
    return finalAnswer;
  }
}
