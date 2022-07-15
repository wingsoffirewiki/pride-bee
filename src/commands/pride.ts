import { Command } from "fero-dc";
import { Sharp } from "sharp";
import { getFlagImage } from "../util/flags";
import { getImageFromURL, circle, refresh } from "../util/sharp";

export default new Command()
  .name("pride")
  .description("Attaches a pride flag to your avatar")
  .category("Pride")
  .options([
    {
      name: "flag",
      description: "The flag to attach",
      type: "STRING",
      required: false
    },
    {
      name: "image",
      description: "The image to use as a flag instead of the flag option",
      type: "ATTACHMENT",
      required: false
    },
    {
      name: "avatar",
      description: "The image to use as the avatar",
      type: "ATTACHMENT",
      required: false
    },
    {
      name: "mask",
      description: "Whether to mask the flag over the avatar",
      type: "BOOLEAN",
      required: false
    },
    {
      name: "blend",
      description: "Whether to blend the flag and blur the lines",
      type: "BOOLEAN",
      required: false
    }
  ])
  .run(async (client, interaction) => {
    const flagString = interaction.options.getString("flag", false);
    const image = interaction.options.getAttachment("image", false);
    const avatarAttachment = interaction.options.getAttachment("avatar", false);
    const mask = interaction.options.getBoolean("mask", false) ?? false;
    const blend = interaction.options.getBoolean("blend", false) ?? false;

    const avatarURL =
      avatarAttachment?.url ??
      interaction.user.avatarURL({
        format: "png",
        size: 1024
      });

    if (!avatarURL) {
      interaction.reply({
        ephemeral: true,
        content: "You must provide an avatar or have a valid avatar"
      });

      return;
    }

    const avatar = await getImageFromURL(avatarURL);

    let flag: Sharp | undefined;

    if (flagString && image) {
      interaction.reply({
        ephemeral: true,
        content: "You can only use one of the flag or image options!"
      });

      return;
    } else if (flagString && !image) {
      flag = getFlagImage(flagString);
    } else if (!flagString && image) {
      flag = (await getImageFromURL(image.url)).resize(1024, 1024, {
        fit: "fill"
      });
    } else {
      flag = getFlagImage("lgbt");
    }

    if (!flag) {
      interaction.reply({
        ephemeral: true,
        content: "Invalid flag!"
      });

      return;
    }

    const renderedImage = await render(flag, avatar, mask, blend);

    const buffer = await renderedImage.png().toBuffer();

    interaction.reply({
      content: "Here you go!",
      files: [
        {
          name: `${
            interaction.user.username
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]/g, "") || "avatar"
          }-pride.png`,
          attachment: buffer
        }
      ]
    });
  });

/**
 * Render the pride flag on the avatar
 * @param flag the flag to attach
 * @param avatar the avatar to attach the flag to
 * @param mask whether to mask the flag over the avatar
 * @param blend whether to blend the flag and blur the lines
 */
async function render(
  flag: Sharp,
  avatar: Sharp,
  mask: boolean,
  blend: boolean
): Promise<Sharp> {
  if (blend) {
    flag = flag.blur(25);
  }

  if (mask) {
    avatar = await circle(avatar);

    flag = flag.composite([
      {
        input: await avatar.toBuffer(),
        blend: "multiply"
      }
    ]);
  } else {
    avatar = await circle(avatar);
    avatar = await refresh(avatar);
    avatar = avatar.resize(944, 944, {
      fit: "cover"
    });

    flag = flag.composite([
      {
        input: await avatar.toBuffer(),
        top: 40,
        left: 40
      }
    ]);
  }

  flag = await refresh(flag);

  return circle(flag);
}

// export const command = new Command(
// 	{
// 		name: "pride",
// 		description: "Attaches pride flag to avatar",
// 		aliases: ["p"],
// 		permissions: ["SEND_MESSAGES"],
// 		category: "pride",
// 		type: "BOTH",
// 		args: [
// 			{
// 				name: "flag",
// 				description: "The flag to attach",
// 				type: "string",
// 				required: false
// 			},
// 			{
// 				name: "options",
// 				description: "The options to apply to the image",
// 				type: "string",
// 				required: false
// 			}
// 		],
// 		slashCommandOptions: [
// 			{
// 				name: "flag",
// 				description: "The flag to attach",
// 				type: "STRING",
// 				required: false
// 			},
// 			{
// 				name: "options",
// 				description: "The options to apply to the image",
// 				type: "STRING",
// 				required: false
// 			}
// 		]
// 	},
// 	async (message, args, client, flag: string, options: string) => {
// 		const f = flag ? alias(flag.toLowerCase()) : "lgbt";

// 		if (!f)
// 			return message.reply(`\`${flag}\` is not a flag!`).catch(err => {
// 				console.log(err);
// 				message.channel.send(
// 					"An error occurred trying to reply. This could be due to the bot requiring the `Read Message History` permission. Please reinvite the bot\nhttps://discord.com/api/oauth2/authorize?client_id=820320243989348392&permissions=2147601408&scope=bot%20applications.commands"
// 				);
// 			});

// 		const optionsParsed = parseOptions(options);

// 		if (!optionsParsed)
// 			return message
// 				.reply(
// 					`Invalid options: \`${options}\`\nThe valid format for options is "-mbs" where m, b, and s stand for mask, blend, and spin.\nOmit any to get the options you want. EX: b!pride lgbt -b (only blends the flag)`
// 				)
// 				.catch(err => {
// 					console.log(err);
// 					message.channel.send(
// 						"An error occurred trying to reply. This could be due to the bot requiring the `Read Message History` permission. Please reinvite the bot\nhttps://discord.com/api/oauth2/authorize?client_id=820320243989348392&permissions=2147601408&scope=bot%20applications.commands"
// 					);
// 				});

// 		const [mask, blend, spin] = optionsParsed;

// 		const author: Discord.User = message["author"];

// 		try {
// 			const att =
// 				message instanceof Message ? message.attachments.first() : null;

// 			const avImage = (
// 				await Jimp.read(
// 					att && flag != "custom"
// 						? att.url
// 						: author.avatarURL({ format: "png", size: 1024 })
// 				)
// 			).resize(1024, 1024);

// 			const avatarImage = mask ? avImage : avImage.crop(40, 40, 944, 944);

// 			if (f == "custom") {
// 				if (!att)
// 					return message
// 						.reply("You did not provide an attachment!")
// 						.catch(err => {
// 							console.log(err);
// 							message.channel.send(
// 								"An error occurred trying to reply. This could be due to the bot requiring the `Read Message History` permission. Please reinvite the bot\nhttps://discord.com/api/oauth2/authorize?client_id=820320243989348392&permissions=2147601408&scope=bot%20applications.commands"
// 							);
// 						});

// 				const attImage = (await Jimp.read(att.url)).resize(1024, 1024);

// 				const output = await render(
// 					attImage,
// 					avatarImage,
// 					mask,
// 					blend,
// 					spin
// 				);

// 				return message
// 					.reply({
// 						content: "Here you go!",
// 						files: [new MessageAttachment(output)]
// 					})
// 					.catch(err => {
// 						console.log(err);
// 						message.channel.send(
// 							"An error occurred trying to reply. This could be due to the bot requiring the `Read Message History` permission. Please reinvite the bot\nhttps://discord.com/api/oauth2/authorize?client_id=820320243989348392&permissions=2147601408&scope=bot%20applications.commands"
// 						);
// 					});
// 			}

// 			const flagImage = await Jimp.read(`./src/Images/${f}.png`);

// 			const output = await render(
// 				flagImage,
// 				avatarImage,
// 				mask,
// 				blend,
// 				spin
// 			);

// 			message
// 				.reply({
// 					content: "Here you go!",
// 					files: [new MessageAttachment(output)]
// 				})
// 				.catch(err => {
// 					console.log(err);
// 					message.channel.send(
// 						"An error occurred trying to reply. This could be due to the bot requiring the `Read Message History` permission. Please reinvite the bot\nhttps://discord.com/api/oauth2/authorize?client_id=820320243989348392&permissions=2147601408&scope=bot%20applications.commands"
// 					);
// 				});
// 		} catch (err) {
// 			console.log(err);

// 			const embed = new MessageEmbed()
// 				.setTitle("An Error Occurred")
// 				.setColor("RED")
// 				.setDescription(
// 					`\`\`\`${`${err}`.replace(
// 						new RegExp(
// 							"C:\\\\Users\\\\evanr\\\\Documents\\\\MEGA\\\\File Transfer\\\\WOFBOTS\\\\",
// 							"g"
// 						),
// 						""
// 					)}\`\`\`The error has been reported and should hopefully be fixed soon!`
// 				);

// 			message.reply({ embeds: [embed] }).catch(err => {
// 				console.log(err);
// 				message.channel.send(
// 					"An error occurred trying to reply. This could be due to the bot requiring the `Read Message History` permission. Please reinvite the bot\nhttps://discord.com/api/oauth2/authorize?client_id=820320243989348392&permissions=2147601408&scope=bot%20applications.commands"
// 				);
// 			});
// 		}
// 	}
// );
