import { Command } from "@ferod/client";
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
} from "discord.js";
import {
	flagsSorted,
	getFlagImage,
	getFlagNameFromAlias,
	type Flag,
} from "../util/flags";

const flagEntries = Object.entries(flagsSorted);
const firstFlag = flagEntries[0][0] as Flag;

export default new Command()
	.setName("flags")
	.setDescription("Get the currently available flags")
	.setCategory("Utility")
	.setOptions(
		{
			name: "list",
			description: "List all flags",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "preview",
			description: "Preview a flag or flags",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "flag",
					description: "The flag to view",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: false,
				},
			],
		},
	)
	.setExecutor(async (client, interaction) => {
		const subCommand = interaction.options.getSubcommand(true);

		if (subCommand === "list") {
			const embed = new EmbedBuilder();

			const flags = flagEntries.map(
				(entry, index) => `${index + 1}: \`${entry.flat().join(", ")}\``,
			);

			embed
				.setTitle("Flags")
				.setDescription(
					`Here are all **${flags.length
					}** flags I currently support!\nDo /flags preview [flag] to view the flag.\nIf you want to suggest/add a flag, please use /contribute.\n\n${flags.join(
						"\n",
					)}`,
				)
				.setColor("Random");

			await interaction.reply({ ephemeral: true, embeds: [embed] });
		} else if (subCommand === "preview") {
			let flagName =
				getFlagNameFromAlias(
					interaction.options.getString("flag", false) ?? firstFlag,
				) ?? firstFlag;

			const attachment = new AttachmentBuilder(getFlagImage(flagName)).setName(
				`${flagName}.png`,
			);

			const embed = new EmbedBuilder()
				.setTitle(`Flag \`${flagName}\``)
				.setImage(`attachment://${flagName}.png`)
				.setColor("Random");

			if (interaction.channel === null) {
				await interaction.reply({
					embeds: [embed],
					files: [attachment],
				});

				return;
			}

			const [previousId, nextId] = [
				`previous-${interaction.id}`,
				`next-${interaction.id}`,
			];

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(previousId)
					.setLabel("Previous")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(nextId)
					.setLabel("Next")
					.setStyle(ButtonStyle.Secondary),
			);

			await interaction.reply({
				embeds: [embed],
				components: [row],
				files: [attachment],
			});

			const collector = interaction.channel?.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: 60 * 1000,
				filter: (buttonInteraction) =>
					buttonInteraction.user.id === interaction.user.id &&
					[previousId, nextId].includes(buttonInteraction.customId) &&
					buttonInteraction.applicationId === interaction.applicationId,
				dispose: true,
				idle: 60 * 1000,
			});

			collector.on("collect", async (buttonInteraction) => {
				const currentIndex = flagEntries.findIndex(
					(entry) => entry[0] === flagName,
				);

				if (buttonInteraction.customId === previousId) {
					if (currentIndex <= 0) {
						await buttonInteraction.reply({
							ephemeral: true,
							content: "There are no more flags before this one.",
						});

						return;
					}

					flagName = flagEntries[currentIndex - 1][0] as Flag;
				} else {
					if (currentIndex >= flagEntries.length - 1) {
						await buttonInteraction.reply({
							ephemeral: true,
							content: "There are no more flags after this one.",
						});

						return;
					}

					flagName = flagEntries[currentIndex + 1][0] as Flag;
				}

				const newAttachment = new AttachmentBuilder(
					getFlagImage(flagName),
				).setName(`${flagName}.png`);

				embed
					.setTitle(`Flag \`${flagName}\``)
					.setImage(`attachment://${flagName}.png`);

				await buttonInteraction.update({
					embeds: [embed],
					files: [newAttachment],
				});
			});
		} else {
			await interaction.reply({
				ephemeral: true,
				content: "Invalid subcommand",
			});
		}
	});
