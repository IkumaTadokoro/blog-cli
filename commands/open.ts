import { Command } from "../deps.ts";
import { BLOG_URL } from "../const.ts";

export class OpenCommand extends Command {
  constructor() {
    super();
    this
      .description("Open blog in browser")
      .action(async () => {
        const process = Deno.run({ cmd: ["open", BLOG_URL] });
        await process.status();
      });
  }
}
