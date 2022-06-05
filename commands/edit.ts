import { Command, Select } from "../deps.ts";
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
          const options = articles.map((article) => {
            return { name: article.title, value: article.name };
          });
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
