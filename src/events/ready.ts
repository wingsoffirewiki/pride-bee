import { Client, Event } from "fero-dc";
import fs from "fs";
import { flagsSorted } from "../util/flags";

export default new Event<"ready">().event("ready").run(async (client) => {
  setPresence(client);
  sortImageList();
});

/**
 * Sets the presence of the bot
 * @param client The client to set the presence of
 */
function setPresence(client: Client<true>): void {
  const presence = () =>
    client.user.setPresence({
      status: "online",
      afk: false,
      activities: [
        {
          name: `/pride in ${client.guilds.cache.size} servers.`,
          type: "WATCHING"
        }
      ]
    });

  presence();
  setInterval(presence, 60000);
}

/**
 * Sorts the image list
 */
function sortImageList(): void {
  fs.writeFileSync(
    "./src/assets/flags.json",
    JSON.stringify(flagsSorted, null, 2)
  );
}
