import { Command, parse } from "../deps.ts";
import { Article, ConfigData, FrontMatter } from "../types.d.ts";

export class ListCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .description("List the last 5 articles")
      .option("-a, --all", "List all articles instead of the last 5 articles")
      .action((options) => {
        const limit = options.all ? -1 : 5
        if (this.config) {
          const blogPath = this.config.blogPath;
          const articles = this.readArticles(blogPath).sort((a, b) => this.sortByDate(a, b)).slice(0, limit);
          console.log(this.formatTree(articles));
        }
      });
  }

  private formatTree(articles: Article[]): string {
    return articles.map((article) => {
      return `${article.name}\n ├──${article.title}\n └──${article.date}`;
    }).join("\n");
  }

  private readArticles(blogPath: string): Article[] {
    const entries = [];
    for (const article of Deno.readDirSync(blogPath)) {
      entries.push(article);
    }
    const candidates = entries.map((entry) => {
      const decoder = new TextDecoder("utf-8");
      const article = decoder.decode(
        Deno.readFileSync(`${blogPath}/${entry.name}`),
      ).trim();
      const { data } = parse(article);
      if (isFrontMatter(data)) {
        return {
          name: entry.name,
          title: data.title,
          date: data.date,
        };
      } else {
        throw new Error();
      }
    });
    return candidates;
  }

  private sortByDate(a: Article, b: Article): number {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  }
}

function isFrontMatter(data: any): data is FrontMatter {
  if (data === null) return false;
  return (
    typeof data.title === "string" &&
    typeof data.date === "string"
  );
}
