import { Command, CompletionsCommand } from "../deps.ts";
import { version } from "../version.ts";
import { BLOG_URL } from "../const.ts";
import { OpenCommand } from "./open.ts";
import { NewCommand } from "./new.ts";
import { ConfigCommand } from "./config.ts";
import { ListCommand } from "./list.ts";
import { ConfigData } from "../types.d.ts";
import { EditCommand } from "./edit.ts";

export class BlogCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .name("blog")
      .version(version)
      .description(`✍️ CLI tool for my blog: ${BLOG_URL}`)
      .command("completions", new CompletionsCommand())
      .command("list", new ListCommand(this.config))
      .command("open", new OpenCommand())
      .command("config", new ConfigCommand())
      .command("new", new NewCommand(this.config))
      .command("edit", new EditCommand(this.config));
  }
}
