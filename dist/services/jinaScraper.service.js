"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinaScraperService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../config/env.config");
class JinaScraperService {
    constructor() { }
    async scrape(articles) {
        console.log(`Starting to scrape ${articles.length} articles...`);
        const scrapePromises = articles.map(async (article, index) => {
            if (!article.link) {
                return null;
            }
            try {
                const response = await axios_1.default.get(`${env_config_1.JINA_API_URL}${article.link}`, {
                    headers: {
                        Authorization: `Bearer ${env_config_1.JINA_API_KEY}`,
                    },
                });
                return {
                    ...article,
                    fullContent: response.data,
                };
            }
            catch (error) {
                console.error(`Failed to scrape ${article.link}:`, error.response?.data || error.message);
                return null;
            }
        });
        const results = (await Promise.all(scrapePromises)).filter(Boolean);
        console.log(`Scraping complete. Successfully scraped ${results.length} articles.`);
        return results;
    }
}
exports.JinaScraperService = JinaScraperService;
