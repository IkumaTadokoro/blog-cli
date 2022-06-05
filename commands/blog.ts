import { Command } from "../deps.ts";
import { version } from "../version.ts";
import { BLOG_URL } from "../const.ts";
import { OpenCommand } from "./open.ts";
import { NewCommand } from "./new.ts";
import { ConfigCommand } from "./config.ts";
import { ConfigData } from "../types.d.ts";

export class BlogCommand extends Command {
  constructor(private config: ConfigData | null) {
    super();
    this
      .name("blog")
      .version(version)
      .description(`✍️ CLI tool for my blog: ${BLOG_URL}`)
      .command("open", new OpenCommand())
      .command("config", new ConfigCommand())
      .command("new", new NewCommand(this.config));
  }
}
