import { createWriteStream } from 'fs';
import { get } from 'https';
import { join } from 'path';

// Image URL for Dior Sauvage
const imageUrl = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90';
const filename = 'dior-sauvage.jpg';
const filePath = join(process.cwd(), 'client', 'src', 'assets', filename);

// Function to download an image
function downloadImage() {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(filePath);
        
        console.log(`Downloading ${filename}...`);
        
        get(imageUrl, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Successfully downloaded ${filename}`);
                resolve(filePath);
            });
        }).on('error', (err) => {
            // Delete the file if it was created
            file.close(() => {
                // Handle error silently
            });
            reject(err);
        });
    });
}

// Download the image
async function downloadDiorImage() {
    try {
        await downloadImage();
        console.log('Dior Sauvage image downloaded successfully!');
    } catch (error) {
        console.error(`Failed to download ${filename}:`, error.message);
    }
}

// Run the download
downloadDiorImage();