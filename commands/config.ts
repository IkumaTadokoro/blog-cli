import { Command, Input, prompt } from "../deps.ts";
import { CONFIG_FILE } from "../const.ts";

export class ConfigCommand extends Command {
  constructor() {
    super();
    this
      .description("Config BLOG_PATH")
      .action(async () => {
        const { blogPath } = await prompt([
          {
            name: "blogPath",
            message: "記事の格納ディレクトリを指定してください",
            id: "blogPath",
            type: Input,
          },
        ]);
        const homeEnv = Deno.env.get("HOME");
        const configFilePath = `${homeEnv}/${CONFIG_FILE}`;
        Deno.writeTextFileSync(configFilePath, JSON.stringify({ blogPath }));
        console.log("設定が完了しました");
      });
  }
}
