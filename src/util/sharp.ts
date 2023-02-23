import sharp, { Sharp } from "sharp";
import axios from "axios";

export async function getImageFromURL(url: string): Promise<Sharp> {
  const response = await axios
    .get(url, { responseType: "arraybuffer" })
    .catch(console.log);

  if (!response) {
    throw new Error("Could not get image from URL");
  }

  const image = sharp(response.data);

  return image;
}

export async function circle(image: Sharp): Promise<Sharp> {
  const metadata = await image.metadata();

  const width = metadata.width ?? 1024;

  const radius = width / 2;

  const circleSVG = Buffer.from(
    `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`
  );

  const composite = image.composite([
    {
      input: circleSVG,
      blend: "dest-in"
    }
  ]);

  return composite;
}

export async function refresh(image: Sharp): Promise<Sharp> {
  return sharp(await image.toBuffer());
}
