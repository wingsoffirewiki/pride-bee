import sharp, { Sharp } from "sharp";

export async function getImageFromURL(url: string): Promise<Sharp> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from ${url}: ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const image = sharp(buffer);
  return image;
}

export async function circle(image: Sharp): Promise<Sharp> {
  const metadata = await image.metadata();

  const width = metadata.width ?? 1024;

  const radius = width / 2;

  const circleSvg = Buffer.from(
    `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`
  );

  const composite = image.composite([
    {
      input: circleSvg,
      blend: "dest-in"
    }
  ]);

  return composite;
}

export async function refresh(image: Sharp): Promise<Sharp> {
  return sharp(await image.toBuffer());
}
