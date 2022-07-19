import * as Discord from "discord.js";
import { CommandBuilder } from "fero-dc";
import { toPascalCase } from "../util/casing";
import {
  Flag,
  flagsSorted,
  getFlagImage,
  getFlagNameFromAlias
} from "../util/flags";

export default new CommandBuilder()
  .name("flags")
  .description("Get the currently available flags")
  .category("Utility")
  .options({
    name: "flag",
    description: "The flag to view",
    type: Discord.ApplicationCommandOptionType.String,
    required: false
  })
  .run((client, interaction) => {
    const flagString = interaction.options.getString("flag", false);

    if (flagString && getFlagNameFromAlias(flagString)) {
      const flagName = getFlagNameFromAlias(flagString) as Flag;

      const flag = getFlagImage(flagName);

      const embed = new Discord.EmbedBuilder();
      const attachment = new Discord.AttachmentBuilder(flag).setName(
        `${flagName}.png`
      );

      embed
        .setTitle(`Flag \`${toPascalCase(flagName)}\``)
        .setImage(`attachment://${flagName}.png`)
        .setColor("Random");

      interaction.reply({
        embeds: [embed],
        files: [attachment]
      });

      return;
    }

    const embed = new Discord.EmbedBuilder();

    const flagEntries = Object.entries(flagsSorted);
    const flags = flagEntries.map(
      (entry, index) => `${index + 1}: \`${entry.flat().join(", ")}\``
    );

    embed
      .setTitle("Flags")
      .setDescription(
        `Here are all **${
          flags.length
        }** flags I currently support!\nDo /flags [flag] to view the flag.\nIf you want to suggest/add a flag, please use /contribute.\n\n${flags.join(
          "\n"
        )}`
      )
      .setColor("Random");

    interaction.reply({ ephemeral: true, embeds: [embed] });
  });
