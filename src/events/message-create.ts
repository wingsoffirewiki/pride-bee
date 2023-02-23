import { EventListener } from "fero-dc";

export default new EventListener<"messageCreate">()
  .setEvent("messageCreate")
  .setHandler((client, message) => {
    if (message.content.startsWith("b!")) {
      message.reply("Pride Bee has been converted to slash commands");
    }
  });
