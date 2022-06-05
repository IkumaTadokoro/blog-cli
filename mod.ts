import { BlogCommand } from "./commands/blog.ts";

if (import.meta.main) {
  new BlogCommand().parse(Deno.args);
}
