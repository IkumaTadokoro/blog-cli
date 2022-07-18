import { Command, Select } from "../deps.ts";
import {blue, dim, green, red, yellow} from "../util.ts";
import { ConfigData } from "../types.d.ts";
import { readArticles } from "../util.ts";

export class EditCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .description("Edit article in editor.")
      .option("-e, --editor <editor>", "Choose your editor. Default is vim", {
        default: "vim",
      })
      .action(async (options) => {
        const editor = options.editor;
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
              name: `${prefix} ${dim(article.date.padEnd(19))} ${article.title}`,
              value: article.name
            };
          }));
          const article: string = await Select.prompt({
            message: "編集するファイルを選択してください",
            options,
            maxRows: 5,
            search: true,
          });
          const target = `${blogPath}/${article}`;
          const process = Deno.run({ cmd: [editor, target] });
          await process.status();
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
