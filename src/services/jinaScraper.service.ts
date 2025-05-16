import axios from "axios";
import { JINA_API_KEY, JINA_API_URL } from "../config/env.config";

interface Article {
  id?: string;
  title?: string;
  content?: string;
  link?: string;
  date?: string;
}

interface ScrapedArticle extends Article {
  fullContent: string;
}

export class JinaScraperService {
  constructor() {}

  public async scrape(articles: Article[]): Promise<ScrapedArticle[]> {
    console.log(`Starting to scrape ${articles.length} articles...`);

    const scrapePromises = articles.map(async (article, index) => {
      if (!article.link) {
        return null;
      }

      try {
        const response = await axios.get(`${JINA_API_URL}${article.link}`, {
          headers: {
            Authorization: `Bearer ${JINA_API_KEY}`,
          },
        });
        return {
          ...article,
          fullContent: response.data,
        };
      } catch (error: any) {
        console.error(
          `Failed to scrape ${article.link}:`,
          error.response?.data || error.message
        );
        return null;
      }
    });

    const results = (await Promise.all(scrapePromises)).filter(
      Boolean
    ) as ScrapedArticle[];
    console.log(
      `Scraping complete. Successfully scraped ${results.length} articles.`
    );

    return results;
  }
}
