import * as Discord from "discord.js";
import { Command } from "fero-dc";
import { flagsSorted } from "../util/flags";

export default new Command()
  .name("flags")
  .description("Get the currently available flags")
  .category("Utility")
  .run((client, interaction) => {
    const embed = new Discord.MessageEmbed();

    const flagEntries = Object.entries(flagsSorted);
    const flags = flagEntries.map(
      (entry, index) => `${index + 1}: \`${entry.flat().join(", ")}\``
    );

    embed
      .setTitle("Flags")
      .setDescription(
        `Here are all **${
          flags.length
        }** flags I currently support!\nIf you want to suggest/add a flag, please use /contribute.\n\n${flags.join(
          "\n"
        )}`
      )
      .setColor("RANDOM");

    interaction.reply({ ephemeral: true, embeds: [embed] });
  });
