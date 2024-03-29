import type { Attachment } from "discord.js";
import sharp, { type Blend, type Sharp } from "sharp";

const IMAGE_SIZE = 1024;
const IMAGE_PADDING = 40;
const IMAGE_SIZE_WITHOUT_PADDING = IMAGE_SIZE - IMAGE_PADDING * 2;

export function isValidImage(attachment: Attachment): boolean {
	return attachment.contentType?.includes("image/") ?? false;
}

export async function render(
	flagImage: Sharp,
	avatar: Sharp,
	mask: boolean,
	blend: boolean,
): Promise<Sharp> {
	const blendedFlagImage = blend ? flagImage.blur(25) : flagImage;

	const circleAvatar = await createCircle(avatar);

	const resizedAvatar = mask
		? avatar
		: await resize(circleAvatar, IMAGE_SIZE_WITHOUT_PADDING);

	const compositeImage = await createComposite(
		blendedFlagImage,
		await resizedAvatar.toBuffer(),
		mask ? "multiply" : "over",
		true,
		mask ? 0 : IMAGE_PADDING,
	);

	const circle = await createCircle(compositeImage);

	return circle;
}

export async function getImageFromUrl(url: string): Promise<Sharp> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch image from ${url}: ${response.statusText}`,
		);
	}

	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const image = sharp(buffer).png();

	const resizedImage = await resize(image, IMAGE_SIZE, false);
	return resizedImage;
}

async function createComposite(
	image: Sharp,
	input: Buffer,
	blend: Blend,
	refreshImage = true,
	padding = 0,
): Promise<Sharp> {
	const refreshedImage = refreshImage ? await refresh(image) : image;

	const composite = refreshedImage.composite([
		{
			input,
			blend,
			top: padding,
			left: padding,
		},
	]);

	return composite;
}

async function createCircle(image: Sharp, refreshImage = true): Promise<Sharp> {
	const refreshedImage = refreshImage ? await refresh(image) : image;

	const metadata = await refreshedImage.metadata();

	const width = metadata.width ?? IMAGE_SIZE;

	const radius = width / 2;

	const circleSvg = Buffer.from(
		`<svg><circle cx="50%" cy="50%" r="${radius}" /></svg>`,
	);

	const composite = await createComposite(
		refreshedImage,
		circleSvg,
		"dest-in",
		false,
	);

	return composite;
}

async function resize(
	image: Sharp,
	size: number,
	refreshImage = true,
): Promise<Sharp> {
	const refreshedImage = refreshImage ? await refresh(image) : image;

	const resized = refreshedImage.resize(size, size);

	return resized;
}

async function refresh(image: Sharp): Promise<Sharp> {
	const refreshedImage = sharp(await image.toBuffer());

	return refreshedImage;
}
