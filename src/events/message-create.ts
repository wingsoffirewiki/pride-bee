import { Event } from "fero-dc";

export default new Event<"messageCreate">()
  .event("messageCreate")
  .run((client, message) => {
    if (message.content.startsWith("b!")) {
      message.reply("Pride Bee has been converted to slash commands");
    }
  });
