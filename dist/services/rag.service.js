"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const jinaScraper_service_1 = require("./jinaScraper.service");
const newsFetcher_service_1 = require("./newsFetcher.service");
const vectorStore_service_1 = require("./vectorStore.service");
class RAGService {
    constructor() {
        this.newsFetcherService = new newsFetcher_service_1.NewsFetcherService();
        this.scraperService = new jinaScraper_service_1.JinaScraperService();
        this.qdrantService = new vectorStore_service_1.QdrantService();
    }
    async initialize() {
        try {
            const articles = await this.newsFetcherService.fetchArticles();
            // const scrapedArticles = await this.scraperService.scrape(articles);
            // const embeddings = await this.generateEmbeddings(scrapedArticles);
            // await this.qdrantService.initCollection(768);
            // await this.qdrantService.insertDocuments(embeddings, scrapedArticles);
        }
        catch (error) {
            console.error('RAG Pipeline failed:', error);
        }
    }
    async generateEmbeddings(articles) {
        const embeddings = articles.map(() => {
            return Array(768).fill(0).map(() => Math.random());
        });
        return embeddings;
    }
}
exports.RAGService = RAGService;
