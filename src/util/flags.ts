import * as fs from "fs";
import { resolve } from "path";
import sharp, { type Sharp } from "sharp";

const flagsDirectory = resolve(process.cwd(), "assets/flags");

export const flags = fs.readdirSync(flagsDirectory)
	.map((fileName) => fileName.replace(".png", ""));

export function getFlagImage(flag: string): Sharp | undefined {
	const flagPath = resolve(flagsDirectory, `${flag}.png`);
	if (!fs.existsSync(flagPath)) {
		return undefined;
	}

	return sharp(flagPath);
}
