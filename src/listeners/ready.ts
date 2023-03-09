import { ActivityType } from "discord.js";
import { Client, EventListener } from "fero-dc";
import * as fs from "fs";
import { flagsSorted } from "../util/flags";

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;

export default new EventListener<"ready">()
	.setEvent("ready")
	.setHandler(async (client) => {
		setPresence(client);
		setInterval(() => setPresence(client), HOUR_IN_MILLISECONDS);

		if (!imagesExist()) {
			process.exit(1);
		}
	});

function setPresence(client: Client<true>): void {
	client.user.setPresence({
		status: "online",
		activities: [
			{
				name: `/pride in ${client.guilds.cache.size} servers.`,
				type: ActivityType.Watching
			}
		]
	});
}

function imagesExist(): boolean {
	const flags = Object.keys(flagsSorted);
	return flags.every((flag) => {
		const exists = fs.existsSync(`./assets/flags/${flag}.png`);

		console.assert(exists, `❌ ${flag}'s image not found.`);

		return exists;
	});
}
