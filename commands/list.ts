import { Command, Table } from "../deps.ts";
import { ConfigData } from "../types.d.ts";
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
          new Table()
            .header(["name", "title", "published_at"])
            .body(articles.map((article) => [article.name, article.title, article.date]))
            .border(true)
            .render();
        }
      });
  }
}
