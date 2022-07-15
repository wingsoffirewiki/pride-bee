import * as Discord from "discord.js";
import { Command } from "fero-dc";
import { flagsSorted, getFlagImage } from "../util/flags";

export default new Command()
  .name("flags")
  .description("Get the currently available flags")
  .category("Utility")
  .options([
    {
      name: "flag",
      description: "The flag to view",
      type: "STRING",
      required: false
    }
  ])
  .run(async (client, interaction) => {
    const flagString = interaction.options.getString("flag", false);

    if (flagString) {
      const flag = await getFlagImage(flagString);

      if (!flag) {
        interaction.reply({
          ephemeral: true,
          content: `Flag \`${flagString}\` not found`
        });

        return;
      }

      const embed = new Discord.MessageEmbed();
      const attachment = new Discord.MessageAttachment(flag, "flag.png");

      embed
        .setTitle(`Flag \`${flagString}\``)
        .setImage("attachment://flag.png")
        .setColor("RANDOM");

      interaction.reply({
        embeds: [embed],
        files: [attachment]
      });

      return;
    }

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
        }** flags I currently support!\nDo /flags [flag] to view the flag.\nIf you want to suggest/add a flag, please use /contribute.\n\n${flags.join(
          "\n"
        )}`
      )
      .setColor("RANDOM");

    interaction.reply({ ephemeral: true, embeds: [embed] });
  });
