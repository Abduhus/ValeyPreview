import puppeteer from 'puppeteer';
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

// Function to scrape Bulgari fragrances page using Puppeteer
async function scrapeBvlgariWithPuppeteer() {
  console.log('🔍 Starting Bvlgari fragrances scraping with Puppeteer...');
  console.log('📄 Target URL: https://www.bulgari.com/en-ae/fragrances\n');

  let browser;
  const results = {
    successful: [],
    failed: [],
    skipped: []
  };

  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Navigating to Bulgari fragrances page...');
    await page.goto('https://www.bulgari.com/en-ae/fragrances', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('✅ Page loaded successfully');

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract image URLs using page evaluation
    console.log('🔍 Extracting product images...');
    const imageUrls = await page.evaluate(() => {
      const images = new Set();

      // Find all img elements
      const imgElements = document.querySelectorAll('img');
      imgElements.forEach(img => {
        const src = img.getAttribute('src') || img.getAttribute('data-src');
        if (src && (src.includes('bulgari') || src.includes('cloudinary'))) {
          // Convert to full URL if needed
          const fullUrl = src.startsWith('http') ? src : `https://www.bulgari.com${src}`;
          images.add(fullUrl);
        }
      });

      // Find images in data attributes
      const allElements = document.querySelectorAll('[data-image], [data-src], [data-original]');
      allElements.forEach(el => {
        const dataImage = el.getAttribute('data-image') || el.getAttribute('data-src') || el.getAttribute('data-original');
        if (dataImage && (dataImage.includes('bulgari') || dataImage.includes('cloudinary'))) {
          const fullUrl = dataImage.startsWith('http') ? dataImage : `https://www.bulgari.com${dataImage}`;
          images.add(fullUrl);
        }
      });

      // Find background images
      const bgElements = document.querySelectorAll('[style*="background-image"]');
      bgElements.forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
          const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
          if (match && match[1] && (match[1].includes('bulgari') || match[1].includes('cloudinary'))) {
            const fullUrl = match[1].startsWith('http') ? match[1] : `https://www.bulgari.com${match[1]}`;
            images.add(fullUrl);
          }
        }
      });

      return Array.from(images);
    });

    console.log(`📊 Found ${imageUrls.length} potential product images`);

    // Filter and process image URLs
    const processedUrls = imageUrls
      .filter(url => url && (url.includes('bulgari') || url.includes('cloudinary')))
      .map(url => getFullQualityUrl(url))
      .filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates

    console.log(`🎯 After processing: ${processedUrls.length} unique full-quality images\n`);

    // Download each image
    for (let i = 0; i < processedUrls.length; i++) {
      const url = processedUrls[i];
      const filename = getFilenameFromUrl(url);
      const filepath = path.join(assetsDir, filename);

      try {
        console.log(`📥 [${i + 1}/${processedUrls.length}] Downloading: ${filename}`);
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
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.log(`   ✗ Failed: ${filename} - ${error.message}`);
        results.failed.push({ url, filename, error: error.message });
      }
    }

  } catch (error) {
    console.log(`❌ Error during scraping: ${error.message}`);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bulgari.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
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

// Run the scraper
scrapeBvlgariWithPuppeteer().catch(console.error);
