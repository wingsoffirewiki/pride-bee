import * as Discord from "discord.js";
import { Command } from "fero-dc";
import { Sharp } from "sharp";
import { toPascalCase } from "../util/casing";
import { getFlagImage, getFlagNameFromAlias } from "../util/flags";
import { getImageFromURL, render } from "../util/sharp";

export default new Command()
	.setName("pride")
	.setDescription("Attaches a pride flag to your avatar")
	.setCategory("Pride")
	.setOptions(
		{
			name: "flag",
			description: "The flag to attach",
			type: Discord.ApplicationCommandOptionType.String,
			required: false
		},
		{
			name: "image",
			description: "The image to use as a flag instead of the flag option",
			type: Discord.ApplicationCommandOptionType.Attachment,
			required: false
		},
		{
			name: "avatar",
			description: "The image to use as the avatar",
			type: Discord.ApplicationCommandOptionType.Attachment,
			required: false
		},
		{
			name: "mask",
			description: "Whether to mask the flag over the avatar",
			type: Discord.ApplicationCommandOptionType.Boolean,
			required: false
		},
		{
			name: "blend",
			description: "Whether to blend the flag and blur the lines",
			type: Discord.ApplicationCommandOptionType.Boolean,
			required: false
		}
	)
	.setPermissions(Discord.PermissionFlagsBits.SendMessages)
	.setExecutor(async (client, interaction) => {
		await interaction.deferReply();

		const flagString = interaction.options.getString("flag", false);
		const image = interaction.options.getAttachment("image", false);
		const avatarAttachment = interaction.options.getAttachment("avatar", false);
		const mask = interaction.options.getBoolean("mask", false) ?? false;
		const blend = interaction.options.getBoolean("blend", false) ?? false;

		const avatarURL =
			avatarAttachment?.url ??
			interaction.user.avatarURL({
				extension: "png",
				size: 1024
			});

		if (!avatarURL) {
			interaction.followUp({
				ephemeral: true,
				content: "You must provide an avatar or have a valid avatar"
			});

			return;
		}

		const avatar = await getImageFromURL(avatarURL);

		let flag: Sharp | undefined;

		if (flagString && image) {
			interaction.followUp({
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
			interaction.followUp({
				ephemeral: true,
				content: "Invalid flag!"
			});

			return;
		}

		const renderedImage = await render(flag, avatar, mask, blend);

		const buffer = await renderedImage.png().toBuffer();

		const fileName = `${
			interaction.user.username.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ||
			"avatar"
		}-pride.png`;

		const attachment = new Discord.AttachmentBuilder(buffer).setName(fileName);
		const embed = new Discord.EmbedBuilder();

		const flagName = flagString && getFlagNameFromAlias(flagString);

		embed
			.setTitle(
				flagName ? `Pride With ${toPascalCase(flagName)} Flag` : "Pride"
			)
			.setDescription("Here you go!")
			.setImage(`attachment://${fileName}`)
			.setColor("Random");

		interaction.followUp({
			embeds: [embed],
			files: [attachment]
		});
	});
