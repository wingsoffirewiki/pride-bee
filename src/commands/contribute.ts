import { Command } from "@ferod/client";
import * as Discord from "discord.js";

const repoLink = "https://github.com/wingsoffirewiki/Pride-Bee";

export default new Command()
	.setName("contribute")
	.setDescription("Shows GitHub link to contribute to the bot")
	.setCategory("Utility")
	.setPermissions(Discord.PermissionFlagsBits.SendMessages)
	.setExecutor((client, interaction) => {
		const embed = new Discord.EmbedBuilder();

		embed
			.setTitle("Contribute")
			.setDescription(
				`You can contribute to the bot by opening an issue or creating a pull request on GitHub.\n\n[GitHub Repository](${repoLink})\n[Issues](${repoLink}/issues)\n[Pull Requests](${repoLink}/pulls)`,
			)
			.setColor("Random");

		interaction.reply({ embeds: [embed] });
	});
