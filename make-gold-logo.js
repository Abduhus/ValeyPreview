import sharp from 'sharp';
import path from 'path';

const inputPath = path.join(process.cwd(), 'attached_assets', 'valley-logo-new.png');
const outputPath = path.join(process.cwd(), 'attached_assets', 'valley-logo-gold.png');

async function makeGoldLogo() {
  try {
    // Create a gold colored version
    await sharp(inputPath)
      .tint({ r: 212, g: 175, b: 55 }) // #D4AF37 gold color
      .png()
      .toFile(outputPath);

    console.log('Gold logo created successfully!');
  } catch (err) {
    console.error('Error creating gold logo:', err);
  }
}

makeGoldLogo();