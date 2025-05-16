import RSSParser from "rss-parser";
import { FEED_URL, LIMIT } from "../config/env.config";

interface NewsArticle {
  id?: string;
  title?: string;
  content?: string;
  link?: string;
  date?: string;
}

export class NewsFetcherService {
  private rssParser: RSSParser;
  private feedUrl: string;

  constructor(feedUrl: string = FEED_URL as string | "" ) {
    this.rssParser = new RSSParser();
    this.feedUrl = feedUrl;
  }

  public async fetchArticles(): Promise<NewsArticle[]> {
    try {
      const feed = await this.rssParser.parseURL(this.feedUrl);
      const articles = feed.items.slice(0, Number(LIMIT) || 50).map((item) => ({
        id: item.guid || item.link,
        title: item.title,
        content: item.contentSnippet || item.content,
        link: item.link,
        date: item.pubDate,
      }));

      return articles;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw new Error("Error fetching articles");
    }
  }
}
