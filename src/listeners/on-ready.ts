import { Client, EventListener } from "@ferod/client";
import chalk from "chalk";
import { ActivityType, Events } from "discord.js";

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;

export default new EventListener()
	.setEvent(Events.ClientReady)
	.setHandler(async (client) => {
		console.log(chalk.green(`${client.user.tag} is ready!`));

		setPresence(client);
		setInterval(() => setPresence(client), HOUR_IN_MILLISECONDS);
	});

function setPresence(client: Client<true>): void {
	client.user.setPresence({
		status: "online",
		activities: [
			{
				// name: `/pride in ${client.guilds.cache.size} servers.`,
				name: `/pride in ${client.guilds.cache.size} servers.`,
				type: ActivityType.Watching,
			},
		],
	});
}
