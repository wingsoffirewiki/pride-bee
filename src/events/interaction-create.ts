import { EventListener } from "fero-dc";

export default new EventListener<"interactionCreate">()
  .setEvent("interactionCreate")
  .setHandler(async (client, interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const commandName = interaction.commandName;

    const command = client.commands.get(commandName);

    if (command) {
      command.executor(client, interaction);
    } else {
      interaction.reply({
        ephemeral: true,
        content: `Command ${commandName} does not exist on this bot!`
      });
    }
  });
