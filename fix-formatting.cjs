const fs = require('fs');

// Read the formatted perfumes file
let data = fs.readFileSync('c:\\Games\\ValleyPreview\\formatted-perfumes.txt', 'utf8');

// Fix the formatting issue in the last entry
data = data.replace(/\s*61_zefiro_1\.webp\",/g, '61_zefiro_1.webp\",');
data = data.replace(/\s*j_1861_zefiro_2\.webp\",/g, 'j_1861_zefiro_2.webp\",');
data = data.replace(/\s*\/xerjoff_xj_1861_zefiro_1\.webp/g, '/xerjoff_xj_1861_zefiro_1.webp');

// Ensure proper formatting for the last entry
data = data.replace(/(\s*imageUrl: "\/perfumes\/xerjoff_xj_1861_zefiro_1\.webp\",)(\s*moodImageUrl: "\/perfumes\/xerjoff_xj_1861_zefiro_2\.webp",)(\s*images: JSON\.stringify\(\["\/perfumes\/xerjoff_xj_1861_zefiro_1\.webp","\/perfumes\/xerjoff_xj_1861_zefiro_2\.webp"\]\),)/g, 
    '        imageUrl: "/perfumes/xerjoff_xj_1861_zefiro_1.webp",\n        moodImageUrl: "/perfumes/xerjoff_xj_1861_zefiro_2.webp",\n        images: JSON.stringify(["/perfumes/xerjoff_xj_1861_zefiro_1.webp","/perfumes/xerjoff_xj_1861_zefiro_2.webp"]),');

// Add a comma at the end if it's missing
if (!data.trim().endsWith(',')) {
    data = data.trim() + ',\n';
}

// Write the corrected data
fs.writeFileSync('c:\\Games\\ValleyPreview\\formatted-perfumes-corrected.txt', data);
console.log('Corrected file created');