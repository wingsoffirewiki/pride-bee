import * as fs from "fs";
import { resolve } from "path";
import sharp, { Sharp } from "sharp";
import flags from "../config/flags.json" assert { type: "json" };

export const flagsSorted = sortFlags();

type FlagObject = typeof flags;
export type Flag = keyof FlagObject;
type Flags = Record<Flag, string[]>;

export function getFlagImage(flag: Flag): Sharp;
export function getFlagImage(flag: string): Sharp | undefined;
export function getFlagImage(flag: Flag | string): Sharp | undefined {
  const flagPath = resolve(
    process.cwd(),
    "./assets/flags",
    `${getFlagNameFromAlias(flag)}.png`
  );

  if (!fs.existsSync(flagPath)) {
    return undefined;
  }

  return sharp(flagPath);
}

function sortFlags(): Flags {
  const entries = Object.entries(flags);

  const sortedEntries = entries.sort((a, b) => a[0].localeCompare(b[0]));

  return Object.fromEntries(sortedEntries) as Flags;
}

export function getFlagNameFromAlias(alias: string): Flag | undefined {
  return (Object.keys(flags) as Flag[]).find((flag) =>
    [flag, ...flags[flag]].includes(alias)
  );
}
