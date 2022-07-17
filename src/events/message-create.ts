import { EventBuilder } from "fero-dc";

export default new EventBuilder<"messageCreate">()
  .event("messageCreate")
  .run((client, message) => {
    if (message.content.startsWith("b!")) {
      message.reply("Pride Bee has been converted to slash commands");
    }
  });
