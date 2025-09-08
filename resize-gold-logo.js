import sharp from 'sharp';
import path from 'path';

const inputPath = path.join(process.cwd(), 'attached_assets', 'valley-logo-gold.png');
const outputPath = path.join(process.cwd(), 'attached_assets', 'valley-logo-gold-resized.png');

sharp(inputPath)
  .resize(80, 80, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log('Gold logo resized to 80x80 with transparent background.');
  })
  .catch(err => {
    console.error('Error resizing gold logo:', err);
  });