import sharp from 'sharp';
import path from 'path';

const inputPath = path.join(process.cwd(), 'attached_assets', 'Untitled design.png');
const outputPath = path.join(process.cwd(), 'attached_assets', 'valley-logo-new.png');

async function convert() {
  try {
    const inputBuffer = await sharp(inputPath)
      .removeAlpha()
      .toColourspace('b-w')
      .threshold(240)
      .toBuffer();

    const alphaChannel = await sharp(inputBuffer)
      .negate()
      .toBuffer();

    await sharp(inputBuffer)
      .joinChannel(alphaChannel)
      .png()
      .toFile(outputPath);

    console.log('New logo converted to PNG with transparent background.');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}

convert();
