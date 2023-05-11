import { EventListener } from "@ferod/client";
import { Events } from "discord.js";

export default new EventListener()
	.setEvent(Events.InteractionCreate)
	.setHandler(async (client, interaction) => {
		if (!interaction.isCommand()) {
			return;
		}

		const command = client.commands.get(interaction.commandName);
		if (command === undefined) {
			return;
		}

		try {
			command.executor(client, interaction);
		} catch (error) {
			console.error(error);
			await interaction
				.reply({
					content: "There was an error while executing this command!",
					ephemeral: true
				})
				.catch((error) => {
					console.error(error);
					return interaction.followUp({
						content: "There was an error while executing this command!",
						ephemeral: true
					});
				})
				.catch(console.error);
		}
	});
