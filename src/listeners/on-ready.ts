import { Client, EventListener } from "@ferod/client";
import chalk from "chalk";
import { ActivityType, Events } from "discord.js";
import * as fs from "fs";
import { flagsSorted } from "../util/flags.js";

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;

export default new EventListener()
	.setEvent(Events.ClientReady)
	.setHandler(async (client) => {
		console.log(chalk.green(`${client.user.tag} is ready!`));

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
