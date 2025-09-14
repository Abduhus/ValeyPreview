const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directory for images if it doesn't exist
const assetsDir = path.join(__dirname, 'client', 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Generic but attractive perfume image URLs that should work
const images = [
    {
        url: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1920&h=800&fit=crop&auto=format&q=90',
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
        const filePath = path.join(assetsDir, image.filename);
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
    console.log('Starting placeholder image downloads...\n');
    
    for (const image of images) {
        try {
            await downloadImage(image);
        } catch (error) {
            console.error(`Failed to download ${image.filename}:`, error.message);
        }
    }
    
    console.log('\nPlaceholder image download process completed!');
    console.log('These are generic images that will work for now.');
    console.log('For brand-specific images, please manually download from the sources provided in download-images-manual.html');
}

// Run the download
downloadAllImages();