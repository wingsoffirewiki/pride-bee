import { Command } from "@ferod/client";
import * as Discord from "discord.js";
import { toPascalCase } from "../util/casing";
import { getFlagImage } from "../util/flags";
import { getImageFromUrl, isValidImage, render } from "../util/sharp";

export default new Command()
	.setName("pride")
	.setDescription("Attaches a pride flag to your avatar")
	.setCategory("Pride")
	.setOptions(
		{
			name: "flag",
			description: "The flag to attach",
			type: Discord.ApplicationCommandOptionType.String,
			autocomplete: true,
			required: false,
		},
		{
			name: "image",
			description: "The image to use as a flag instead of the flag option",
			type: Discord.ApplicationCommandOptionType.Attachment,
			required: false,
		},
		{
			name: "avatar",
			description: "The image to use as the avatar",
			type: Discord.ApplicationCommandOptionType.Attachment,
			required: false,
		},
		{
			name: "mask",
			description: "Whether to mask the flag over the avatar",
			type: Discord.ApplicationCommandOptionType.Boolean,
			required: false,
		},
		{
			name: "blend",
			description: "Whether to blend the flag and blur the lines",
			type: Discord.ApplicationCommandOptionType.Boolean,
			required: false,
		},
	)
	.setPermissions(Discord.PermissionFlagsBits.SendMessages)
	.setExecutor(async (client, interaction) => {
		try {
			await interaction.deferReply();

			const flagName = interaction.options.getString("flag", false);
			const image = interaction.options.getAttachment("image", false);
			if (image && !isValidImage(image)) {
				await interaction.followUp({
					ephemeral: true,
					content: "Invalid image!",
				});

				return;
			}
			const avatarAttachment = interaction.options.getAttachment("avatar", false);
			if (avatarAttachment && !isValidImage(avatarAttachment)) {
				await interaction.followUp({
					ephemeral: true,
					content: "Invalid image!",
				});

				return;
			}
			const mask = interaction.options.getBoolean("mask", false) ?? false;
			const blend = interaction.options.getBoolean("blend", false) ?? false;

			const avatarUrl =
			avatarAttachment?.url ??
			interaction.user.avatarURL({
				extension: "png",
				size: 1024,
			});

			if (!avatarUrl) {
				interaction.followUp({
					ephemeral: true,
					content: "You must provide an avatar or have a valid avatar",
				});

				return;
			}

			const avatar = await getImageFromUrl(avatarUrl);

			if (flagName && image) {
				interaction.followUp({
					ephemeral: true,
					content: "You can only use one of the flag or image options!",
				});

				return;
			}

			const flag = image
				? await getImageFromUrl(image.url)
				: getFlagImage(flagName ?? "lgbt");

			if (!flag) {
				interaction.followUp({
					ephemeral: true,
					content: "Invalid flag!",
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

			embed
				.setTitle(
					flagName ? `Pride With ${toPascalCase(flagName)} Flag` : "Pride",
				)
				.setDescription("Here you go!")
				.setImage(`attachment://${fileName}`)
				.setColor("Random");

			interaction.followUp({
				embeds: [embed],
				files: [attachment],
			});
		} catch (error) {
			console.error(error);
		}
	});
