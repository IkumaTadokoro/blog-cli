import { BlogCommand } from "./commands/blog.ts";
import { loadConfig } from "./loadConfig.ts";

if (import.meta.main) {
  const config = await loadConfig();
  new BlogCommand(config).parse(Deno.args);
}
