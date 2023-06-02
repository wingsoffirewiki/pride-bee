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
			await command.executor(client, interaction);
		} catch (replyError) {
			console.error(replyError);
			await interaction
				.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				})
				.catch((followUpError) => {
					console.error(followUpError);
					return interaction.followUp({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				})
				.catch(console.error);
		}
	});
