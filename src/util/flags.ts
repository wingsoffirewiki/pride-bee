import * as fs from "fs";
import { resolve } from "path";
import sharp, { Sharp } from "sharp";
import flags from "../config/flags.json";

export const flagsSorted = sortFlags();

export type Flags = typeof flags;
export type Flag = keyof Flags;

export function getFlagImage(flag: Flag): Sharp;
export function getFlagImage(flag: string): Sharp | undefined;
/**
 * Gets the flag image for the given flag.
 * @param flag the flag to get the image of
 */
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

/**
 * Sorts the flags by their name.
 */
function sortFlags(): Flags {
  const entries = Object.entries(flags);

  const sortedEntries = entries
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => [entry[0], entry[1].sort((a, b) => a.localeCompare(b))]);

  return Object.fromEntries(sortedEntries);
}

/**
 * Gets the original name of the flag from an alias.
 * @param alias the alias of the flag
 */
function getFlagNameFromAlias(alias: string): Flag | undefined {
  return (Object.keys(flags) as Flag[]).find((flag) =>
    [flag, ...flags[flag]].includes(alias)
  );
}
