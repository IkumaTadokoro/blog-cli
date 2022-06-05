import { Command } from "../deps.ts";
import { Article, ConfigData } from "../types.d.ts";
import { readArticles } from "../util.ts";

export class ListCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .description("List the last 5 articles")
      .option("-a, --all", "List all articles instead of the last 5 articles")
      .action((options) => {
        const limit = options.all ? -1 : 5;
        if (this.config) {
          const blogPath = this.config.blogPath;
          const articles = readArticles(blogPath).slice(0, limit);
          console.log(this.formatTree(articles));
        }
      });
  }

  private formatTree(articles: Article[]): string {
    return articles.map((article) => {
      return `${article.name}\n ├──${article.title}\n └──${article.date}`;
    }).join("\n");
  }
}
