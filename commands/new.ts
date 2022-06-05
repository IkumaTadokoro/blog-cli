import { Command, format, Input, prompt } from "../deps.ts";
import { ConfigData } from "../types.d.ts";

export class NewCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .description("Create new article")
      .action(async () => {
        const { fileName, title } = await prompt([{
          name: "fileName",
          message: "ファイル名を入力してください",
          hint: "拡張子は不要です",
          id: "fileName",
          type: Input,
        }, {
          name: "title",
          message: "記事のタイトルを入力してください",
          id: "title",
          type: Input,
        }]);
        const today = format(new Date(), "yyyy-MM-dd HH:MM:ss");
        const frontMatter = createFrontMatter(title, today);
        if (this.config) {
          const article = `${this.config.blogPath}/${fileName}.md`;
          await Deno.writeTextFile(article, frontMatter);
          console.log(`記事を作成しました: ${article}`);
        }
      });
  }
}

function createFrontMatter(title: string, date: string): string {
  const frontMatter = `---
title: "${title}"
date: "${date}"
---
`;
  return frontMatter;
}
