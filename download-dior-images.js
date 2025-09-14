import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs of high-quality Christian Dior perfume bottle images from Unsplash
const imageUrls = [
  // Dior Sauvage and other Dior perfumes from Unsplash - high quality 700x1200
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=1200&q=80',
  'https://images.unsplash.com/photo-1617103996386-c42684d7c7c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=1200&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=1200&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=1200&q=80',
  'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=1200&q=80',
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=1200&q=80'
];

// Function to download an image from a URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'perfumes', filename);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File ${filename} already exists, skipping...`);
      resolve(filePath);
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve(filePath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function to download all images
async function downloadAllImages() {
  console.log('Starting to download high-quality Christian Dior perfume bottle images...');
  
  try {
    // Ensure the perfumes directory exists
    const perfumesDir = path.join(__dirname, 'perfumes');
    if (!fs.existsSync(perfumesDir)) {
      fs.mkdirSync(perfumesDir, { recursive: true });
    }
    
    // Download each image
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      // Create more descriptive filenames
      const filename = `dior_luxury_perfume_${i + 1}.jpg`;
      
      try {
        await downloadImage(url, filename);
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
      }
    }
    
    console.log('Finished downloading Christian Dior perfume images.');
    console.log('Images saved to the "perfumes" directory.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the download function
downloadAllImages();