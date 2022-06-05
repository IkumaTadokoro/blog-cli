import { CONFIG_FILE } from "./const.ts";
import { ConfigData } from "./types.d.ts";

export function loadConfig(): ConfigData | null {
  const homeEnv = Deno.env.get("HOME");
  const configFilePath = `${homeEnv}/${CONFIG_FILE}`;
  const config: ConfigData = JSON.parse(Deno.readTextFileSync(configFilePath));
  return config;
}
