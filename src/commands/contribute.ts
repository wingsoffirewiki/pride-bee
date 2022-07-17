import * as Discord from "discord.js";
import { CommandBuilder } from "fero-dc";

const repoLink = "https://github.com/wingsoffirewiki/Pride-Bee";

export default new CommandBuilder()
  .name("contribute")
  .description("Shows GitHub link to contribute to the bot")
  .category("Utility")
  .run((client, interaction) => {
    const embed = new Discord.EmbedBuilder();

    embed
      .setTitle("Contribute")
      .setDescription(
        `You can contribute to the bot by opening an issue or creating a pull request on GitHub.\n\n[GitHub Repository](${repoLink})\n[Issues](${repoLink}/issues)\n[Pull Requests](${repoLink}/pulls)`
      )
      .setColor("Random");

    interaction.reply({ embeds: [embed] });
  });
