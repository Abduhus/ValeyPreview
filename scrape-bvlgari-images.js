import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assets/perfumes directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets', 'perfumes');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Function to make HTTP requests and get page content
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Making request to: ${url}`);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000 // 15 second timeout
    }, (response) => {
      console.log(`📡 Response status: ${response.statusCode}`);
      console.log(`📡 Response headers:`, response.headers);

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log(`📄 Received ${data.length} characters of HTML`);
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });

    request.on('error', (error) => {
      console.log(`❌ Request error: ${error.message}`);
      reject(error);
    });

    request.on('timeout', () => {
      console.log(`⏰ Request timeout for ${url}`);
      request.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

// Function to extract image URLs from Bulgari's HTML content
function extractBvlgariImageUrls(html) {
  const imageUrls = new Set();

  // Bulgari-specific image URL patterns
  const patterns = [
    // Main product images
    /https:\/\/[^"'\s)]*\.bulgari\.com\/[^"'\s)]*\.(jpg|jpeg|png|webp)/gi,
    // Image URLs in src attributes
    /src="([^"]*\.bulgari\.com\/[^"]*\.(jpg|jpeg|png|webp))"/gi,
    // Background images
    /background-image:\s*url\(['"]?([^'")\s]*\.bulgari\.com\/[^'")\s]*\.(jpg|jpeg|png|webp))['"]?\)/gi,
    // Data attributes with images
    /data-[^=]*="([^"]*\.bulgari\.com\/[^"]*\.(jpg|jpeg|png|webp))"/gi,
    // JSON-LD structured data images
    /"image":\s*"([^"]*\.bulgari\.com\/[^"]*\.(jpg|jpeg|png|webp))"/gi,
    // Product gallery images
    /https:\/\/[^"'\s)]*bulgari[^"'\s)]*\/[^"'\s)]*\.(jpg|jpeg|png|webp)/gi
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1] || match[0];
      if (url && url.includes('bulgari')) {
        // Try to get full quality version by removing size parameters
        const fullQualityUrl = getFullQualityUrl(url);
        imageUrls.add(fullQualityUrl);
      }
    }
  });

  return Array.from(imageUrls);
}

// Function to convert image URLs to full quality versions
function getFullQualityUrl(url) {
  // Remove common size parameters and get original quality
  let fullUrl = url;

  // Remove width/height parameters from URLs
  fullUrl = fullUrl.replace(/\/w_\d+\//g, '/w_1200/'); // Set to high width
  fullUrl = fullUrl.replace(/\/h_\d+\//g, '/h_1600/'); // Set to high height
  fullUrl = fullUrl.replace(/\/c_limit[^\/]*/g, '/c_limit,w_1200,h_1600'); // Cloudinary style
  fullUrl = fullUrl.replace(/\/q_\d+\//g, '/q_100/'); // Set quality to 100%
  fullUrl = fullUrl.replace(/\/f_auto[^\/]*/g, '/f_auto,q_100'); // Auto format with high quality

  // If no size parameters found, try to find original version
  if (fullUrl === url) {
    fullUrl = url.replace(/\?.*$/, ''); // Remove query parameters
    fullUrl = fullUrl.replace(/_[0-9]+x[0-9]+\./, '.'); // Remove size suffix like _300x300
    fullUrl = fullUrl.replace(/-300x300\./, '.'); // Remove -300x300 suffix
    fullUrl = fullUrl.replace(/-600x600\./, '.'); // Remove -600x600 suffix
  }

  return fullUrl;
}

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.bulgari.com/'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage} for ${url}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file async
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

// Function to get filename from URL
function getFilenameFromUrl(url) {
  const urlPath = new URL(url).pathname;
  let filename = path.basename(urlPath);

  // Handle URLs with query parameters
  filename = filename.split('?')[0];

  // Ensure we have a proper extension
  if (!filename.includes('.')) {
    filename += '.jpg'; // Default extension
  }

  // Clean up filename for Bvlgari products
  filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  filename = `bvlgari_${filename}`;

  return filename;
}

// Main scraping and download function
async function scrapeBvlgariImages() {
  console.log('🔍 Starting Bvlgari fragrances image scraping...');
  console.log('📄 Target URL: https://www.bulgari.com/en-ae/fragrances\n');

  const results = {
    successful: [],
    failed: [],
    skipped: []
  };

  try {
    // Fetch the main fragrances page
    console.log('📄 Fetching fragrances page...');
    const html = await fetchPage('https://www.bulgari.com/en-ae/fragrances');
    console.log('✅ Page fetched successfully');

    // Extract image URLs
    const imageUrls = extractBvlgariImageUrls(html);
    console.log(`📊 Found ${imageUrls.length} potential Bvlgari product images\n`);

    // Download each image
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = getFilenameFromUrl(url);
      const filepath = path.join(assetsDir, filename);

      try {
        console.log(`📥 [${i + 1}/${imageUrls.length}] Downloading: ${filename}`);
        console.log(`   URL: ${url}`);

        // Skip if file already exists and has content
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          if (stats.size > 0) {
            console.log(`   ✓ File already exists: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
            results.skipped.push({ url, filename, size: stats.size });
            continue;
          }
        }

        await downloadImage(url, filepath);
        const stats = fs.statSync(filepath);
        console.log(`   ✓ Downloaded: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
        results.successful.push({ url, filename, size: stats.size });

        // Add delay between downloads to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.log(`   ✗ Failed: ${filename} - ${error.message}`);
        results.failed.push({ url, filename, error: error.message });
      }
    }

  } catch (error) {
    console.log(`❌ Error fetching page: ${error.message}`);
    return results;
  }

  // Summary
  console.log('\n🎉 === DOWNLOAD SUMMARY ===');
  console.log(`Total images found: ${results.successful.length + results.failed.length + results.skipped.length}`);
  console.log(`Successfully downloaded: ${results.successful.length}`);
  console.log(`Already existed: ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);

  // Calculate total size
  const totalSize = [...results.successful, ...results.skipped]
    .reduce((sum, item) => sum + item.size, 0);

  console.log(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);

  if (results.successful.length > 0) {
    console.log('\n✅ New downloads:');
    results.successful.forEach(item => {
      console.log(`   ${item.filename} (${(item.size / 1024).toFixed(1)}KB)`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.slice(0, 10).forEach(item => {
      console.log(`   ${item.filename}: ${item.error}`);
    });
    if (results.failed.length > 10) {
      console.log(`   ... and ${results.failed.length - 10} more failures`);
    }
  }

  console.log(`\n📁 All images saved to: ${assetsDir}`);

  return results;
}

// Run the scraper
scrapeBvlgariImages().catch(console.error);
