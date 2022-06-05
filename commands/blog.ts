import { Command } from "../deps.ts";
import { version } from "../version.ts";
import { BLOG_URL } from "../const.ts";
import { OpenCommand } from "./open.ts";

export class BlogCommand extends Command {
  constructor() {
    super();
    this
      .name("blog")
      .version(version)
      .description(`✍️ CLI tool for my blog: ${BLOG_URL}`)
      .command("open", new OpenCommand());
  }
}
