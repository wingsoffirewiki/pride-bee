import { Event } from "fero-dc";
import { setTimeout as sleep } from "node:timers/promises";

export default new Event<"messageCreate">()
  .event("messageCreate")
  .run(async (client, message) => {
    if (message.content.startsWith("b!")) {
      const reply = await message.reply(
        "Pride Bee has been converted to slash commands"
      );

      await sleep(5000);

      reply.delete();
      message.delete();
    }
  });
