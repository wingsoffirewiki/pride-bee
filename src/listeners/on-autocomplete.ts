import { EventListener } from "@ferod/client";
import { flags } from "../util/flags";

export default new EventListener()
	.setEvent("interactionCreate")
	.setHandler(async (client, interaction) => {
		if (!interaction.isAutocomplete()) {
			return;
		}

		const command = client.commands.get(interaction.commandName);
		if (command === undefined) {
			return;
		}

		const focused = interaction.options.getFocused();

		const choices = flags
			.filter((flagName) => flagName.startsWith(focused))
			.slice(0, 25);

		await interaction.respond(
			choices.map((choice) => ({
				name: choice,
				value: choice,
			})),
		);
	});
