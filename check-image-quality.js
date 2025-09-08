#!/usr/bin/env node

/**
 * Image Quality Checker
 * 
 * This script checks the quality of product images by analyzing file sizes
 * and identifying potential thumbnails that should be replaced with 
 * higher quality versions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');
const THUMBNAIL_THRESHOLD_KB = 50; // Files smaller than this are considered thumbnails
const LOW_QUALITY_THRESHOLD_KB = 100; // Files smaller than this may need quality improvement

/**
 * Check if a file is a thumbnail based on size
 * @param {string} filePath - Path to the image file
 * @returns {boolean} - True if file is likely a thumbnail
 */
function isThumbnail(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    return sizeKB < THUMBNAIL_THRESHOLD_KB;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Check if a file is low quality based on size
 * @param {string} filePath - Path to the image file
 * @returns {boolean} - True if file is potentially low quality
 */
function isLowQuality(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    return sizeKB < LOW_QUALITY_THRESHOLD_KB && sizeKB >= THUMBNAIL_THRESHOLD_KB;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get human readable file size
 * @param {string} filePath - Path to the file
 * @returns {string} - Formatted file size
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    return `${sizeKB.toFixed(1)}KB`;
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Scan directory for image files and analyze quality
 * @param {string} dirPath - Directory to scan
 */
function scanImageQuality(dirPath) {
  console.log('🔍 Scanning image quality in:', dirPath);
  console.log('=' .repeat(50));
  
  try {
    const files = fs.readdirSync(dirPath);
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp') || file.endsWith('.png')
    );
    
    const thumbnails = [];
    const lowQuality = [];
    const goodQuality = [];
    
    imageFiles.forEach(file => {
      const filePath = path.join(dirPath, file);
      
      if (isThumbnail(filePath)) {
        thumbnails.push({
          name: file,
          path: filePath,
          size: getFileSize(filePath)
        });
      } else if (isLowQuality(filePath)) {
        lowQuality.push({
          name: file,
          path: filePath,
          size: getFileSize(filePath)
        });
      } else {
        goodQuality.push({
          name: file,
          path: filePath,
          size: getFileSize(filePath)
        });
      }
    });
    
    // Report findings
    console.log(`\n📊 Scan Results:`);
    console.log(`  Total images: ${imageFiles.length}`);
    console.log(`  High quality: ${goodQuality.length}`);
    console.log(`  Low quality: ${lowQuality.length}`);
    console.log(`  Thumbnails: ${thumbnails.length}`);
    
    if (thumbnails.length > 0) {
      console.log(`\n⚠️  Thumbnails detected (should be replaced):`);
      thumbnails.forEach(img => {
        console.log(`  - ${img.name} (${img.size})`);
      });
    }
    
    if (lowQuality.length > 0) {
      console.log(`\n⚠️  Low quality images (consider upgrading):`);
      lowQuality.forEach(img => {
        console.log(`  - ${img.name} (${img.size})`);
      });
    }
    
    if (goodQuality.length > 0 && thumbnails.length === 0 && lowQuality.length === 0) {
      console.log(`\n✅ All images appear to be high quality!`);
    }
    
    // Recommendations
    console.log(`\n💡 Recommendations:`);
    if (thumbnails.length > 0) {
      console.log(`  - Replace all thumbnails with full-size images`);
    }
    if (lowQuality.length > 0) {
      console.log(`  - Consider upgrading low quality images`);
    }
    if (goodQuality.length > 0) {
      console.log(`  - Continue monitoring for new higher quality versions`);
    }
    
  } catch (error) {
    console.error('❌ Error scanning directory:', error.message);
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🖼️  Product Image Quality Checker');
  console.log('==================================\n');
  
  // Check if assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }
  
  // Scan image quality
  scanImageQuality(ASSETS_DIR);
  
  console.log(`\n✨ Quality check complete!`);
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { isThumbnail, isLowQuality, getFileSize, scanImageQuality };