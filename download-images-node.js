const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directory for images if it doesn't exist
const imagesDir = path.join(__dirname, 'perfume-images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Image URLs for Versace and Dior
const images = [
    {
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&h=800&fit=crop&auto=format&q=90',
        filename: 'versace-eros.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90',
        filename: 'dior-sauvage.jpg'
    }
];

// Function to download an image
function downloadImage(image) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(imagesDir, image.filename);
        const file = fs.createWriteStream(filePath);
        
        console.log(`Downloading ${image.filename}...`);
        
        https.get(image.url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Successfully downloaded ${image.filename}`);
                resolve(filePath);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete the file async
            reject(err);
        });
    });
}

// Download all images
async function downloadAllImages() {
    console.log('Starting image downloads...\n');
    
    for (const image of images) {
        try {
            await downloadImage(image);
        } catch (error) {
            console.error(`Failed to download ${image.filename}:`, error.message);
            
            // Try alternative URLs
            console.log(`Trying alternative URLs for ${image.filename}...`);
            
            // Add alternative URLs here if needed
            // For now, we'll just note that manual download is required
        }
    }
    
    console.log('\nImage download process completed!');
    console.log('Next steps:');
    console.log('1. Move downloaded images to c:\\Games\\ValleyPreview\\client\\src\\assets\\');
    console.log('2. Convert all images to WebP format and resize to 1920x800px');
    console.log('3. Update the brand-showcase.tsx component imports');
    console.log('4. Replace Unsplash URLs with local image imports');
}

// Run the download
downloadAllImages();