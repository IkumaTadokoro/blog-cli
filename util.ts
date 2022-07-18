import { colors } from './deps.ts'
import { Article, FrontMatter } from "./types.d.ts";
import { parse } from "https://deno.land/x/frontmatter@v0.1.4/mod.ts";

export function readArticles(blogPath: string): Article[] {
  const entries = [];
  for (const article of Deno.readDirSync(blogPath)) {
    entries.push(article);
  }
  const candidates = entries.map((entry) => {
    const decoder = new TextDecoder("utf-8");
    const article = decoder.decode(
      Deno.readFileSync(`${blogPath}/${entry.name}`),
    ).trim();
    const { data } = parse(article);
    if (isFrontMatter(data)) {
      return {
        name: entry.name,
        title: data.title,
        date: data.date,
      };
    } else {
      throw new Error();
    }
  });
  return candidates.sort((a, b) => sortByDate(a, b));
}

function sortByDate(a: Article, b: Article): number {
  if (a.date < b.date) return 1;
  if (a.date > b.date) return -1;
  return 0;
}

function isFrontMatter(data: any): data is FrontMatter {
  if (data === null) return false;
  return (
    typeof data.title === "string" &&
    typeof data.date === "string"
  );
}

export const red = colors.bold.red;
export const green = colors.bold.green;
export const blue = colors.bold.blue;
export const yellow = colors.bold.yellow;
