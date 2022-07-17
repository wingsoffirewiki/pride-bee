import { EventBuilder } from "fero-dc";

export default new EventBuilder<"interactionCreate">()
  .event("interactionCreate")
  .run(async (client, interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const commandName = interaction.commandName;

    const command = client.commands.get(commandName);

    if (command) {
      command.data.run(client, interaction);
    } else {
      interaction.reply({
        ephemeral: true,
        content: `Command ${commandName} does not exist on this bot!`
      });
    }
  });
