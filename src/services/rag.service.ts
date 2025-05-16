import { JinaScraperService } from "./jinaScraper.service";
import { NewsFetcherService } from "./newsFetcher.service";
import { RAGQueryService } from "./ragQuery.service";
import { QdrantService } from "./vectorStore.service"; 

export class RAGService {
  private newsFetcherService: NewsFetcherService;
  private scraperService: JinaScraperService;
  private qdrantService: QdrantService; 
  constructor() {
    this.newsFetcherService = new NewsFetcherService();
    this.scraperService = new JinaScraperService();
    this.qdrantService = new QdrantService(); 
  }

  public async initialize() {
    try {
      const articles = await this.newsFetcherService.fetchArticles();
      // const scrapedArticles = await this.scraperService.scrape(articles);
      // const embeddings = await this.generateEmbeddings(scrapedArticles);
      // await this.qdrantService.initCollection(768);
      // await this.qdrantService.insertDocuments(embeddings, scrapedArticles);
    } catch (error) {
      console.error('RAG Pipeline failed:', error);
    }
  }

  private async generateEmbeddings(articles: any[]): Promise<number[][]> {
    const embeddings = articles.map(() => {
      return Array(768).fill(0).map(() => Math.random()); 
    });

    return embeddings;
  }
}
