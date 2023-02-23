import { ActivityType } from "discord.js";
import { Client, EventListener } from "fero-dc";
import fs from "fs";
import { flagsSorted } from "../util/flags";
import prettier from "prettier";

export default new EventListener<"ready">()
  .setEvent("ready")
  .setHandler(async (client) => {
    setPresence(client);
    sortImageList();
    checkIfEachImageExists();
  });

function setPresence(client: Client<true>): void {
  const presence = () =>
    client.user.setPresence({
      status: "online",
      afk: false,
      activities: [
        {
          name: `/pride in ${client.guilds.cache.size} servers.`,
          type: ActivityType.Watching
        }
      ]
    });

  presence();
  setInterval(presence, 60000);
}

function sortImageList(): void {
  fs.writeFileSync(
    "./src/config/flags.json",
    prettier.format(JSON.stringify(flagsSorted), {
      parser: "json"
    })
  );
}

function checkIfEachImageExists(): void {
  const allExist = Object.keys(flagsSorted)
    .map((flag) => {
      const exists = fs.existsSync(`./assets/flags/${flag}.png`);

      console.log(
        exists ? `✅ ${flag}'s image found.` : `❌ ${flag}'s image not found.`
      );

      return exists;
    })
    .every((exists) => exists);

  if (allExist) {
    console.log("✅ All images found.");
  } else {
    console.log("❌ Some flags do not exist.");

    process.exit(1);
  }
}
