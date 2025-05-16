"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsFetcherService = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
const env_config_1 = require("../config/env.config");
class NewsFetcherService {
    constructor(feedUrl = env_config_1.FEED_URL) {
        this.rssParser = new rss_parser_1.default();
        this.feedUrl = feedUrl;
    }
    async fetchArticles() {
        try {
            const feed = await this.rssParser.parseURL(this.feedUrl);
            const articles = feed.items.slice(0, Number(env_config_1.LIMIT) || 50).map((item) => ({
                id: item.guid || item.link,
                title: item.title,
                content: item.contentSnippet || item.content,
                link: item.link,
                date: item.pubDate,
            }));
            return articles;
        }
        catch (error) {
            console.error("Error fetching articles:", error);
            throw new Error("Error fetching articles");
        }
    }
}
exports.NewsFetcherService = NewsFetcherService;
