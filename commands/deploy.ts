import { Command, Select } from "../deps.ts";
import { ConfigData} from "../types.d.ts";
import { red, green, blue, yellow, readArticles } from "../util.ts";

export class DeployCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .description("Deploy article.")
      .option("-m, --message <message>", "Choose your commit message. Default is `update post`", {
        default: "update post",
      })
      .action(async (options) => {
        const message = options.message;
        if (this.config) {
          const blogPath = this.config.blogPath;
          const articles = readArticles(blogPath);
          const options = await Promise.all(articles.map(async (article) => {
            const gitStatus = await Deno.run({
              cmd: ["git", "status", "-s", article.name],
              cwd: blogPath,
              stdout: "piped"
            });
            const statusString = new TextDecoder().decode(await gitStatus.output()).replace(/\r?\n/g, '')
            const prefix = colorlize(/(..)/.exec(statusString) ? /(..)/.exec(statusString)![0] : '  ')
            return {
              name: `${prefix} ${article.title}`,
              value: article.name
            };
          }));
          const article: string = await Select.prompt({
            message: "デプロイする記事を選択してください",
            options,
            maxRows: 5,
            search: true,
          });
          await Deno.run( { cmd: ["git", "add", article], cwd: blogPath } ).status();
          await Deno.run({ cmd: ["git", "commit", "-m", message], cwd: blogPath }).status();
          await Deno.run({ cmd: ["git", "push"], cwd: blogPath }).status();
        }
      });
  }
}

const colorlize = (prefix: string): string => {
  switch (prefix) {
    case ' M':
      return red(prefix)
    case 'M ':
      return green(prefix)
    case '??':
      return blue(prefix)
    default:
      return yellow('<>')
  }
}
