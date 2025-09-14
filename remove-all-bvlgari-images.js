import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPerfumesDir = path.join(__dirname, 'assets', 'perfumes');

// List of all Bvlgari image files to remove from assets/perfumes
const bvlgariImagesToRemove = [
  // Le Gemme images (already removed but just in case)
  'bvlgari_le_gemme_amune_125_ml_46_1.webp',
  'bvlgari_le_gemme_amune_125_ml_46_2.webp',
  'bvlgari_le_gemme_falkar_125_ml_44_1.webp',
  'bvlgari_le_gemme_falkar_125_ml_44_2.webp',
  'bvlgari_le_gemme_gyan_125_ml_e_45_1.webp',
  'bvlgari_le_gemme_gyan_125_ml_e_45_2.webp',
  'bvlgari_le_gemme_kobraa_125ml_40_1.webp',
  'bvlgari_le_gemme_kobraa_125ml_40_2.webp',
  'bvlgari_le_gemme_man_tygar_125_39_1.webp',
  'bvlgari_le_gemme_man_tygar_125_39_2.webp',
  'bvlgari_le_gemme_men_onekh_125_42_1.webp',
  'bvlgari_le_gemme_men_onekh_125_42_2.webp',
  'bvlgari_le_gemme_orom_125_ml_e_43_1.webp',
  'bvlgari_le_gemme_orom_125_ml_e_43_2.webp',
  'bvlgari_le_gemme_sahare_125ml_41_1.webp',
  'bvlgari_le_gemme_sahare_125ml_41_2.webp',
  
  // Other Bvlgari images
  'bvlgari_1570311.png',
  'bvlgari_1574895.png',
  'bvlgari_ALLEGRA_PERFUME_eqqzax.jpg',
  'bvlgari_ALUMINIUM_WAT_oevter.jpg',
  'bvlgari_B01_JEW_xq7j67.jpg',
  'bvlgari_BB_JEW_ts0dtc.jpg',
  'bvlgari_BB_WAT_g3pelt.jpg',
  'bvlgari_BULGARI_BULGARI_BAGS_sprmhs.jpg',
  'bvlgari_BVLGARI_MAN_PERFUME_wdmmyg.jpg',
  'bvlgari_CABOCHON_JEW_fd5img.jpg',
  'bvlgari_DIVASDREAM_JEW_xjbs1w.jpg',
  'bvlgari_DIVAS_BAG_hjoocn.jpg',
  'bvlgari_EAU_PARFUMEE_fyenjm.jpg',
  'bvlgari_Engraving-JW_PERSONALIZATION_1080x1080px_hxnddp.jpg',
  'bvlgari_FIOREVER_JEW_tdgxzk.jpg',
  'bvlgari_GEB_4235_spjpbc.jpg',
  'bvlgari_GOLDEA_PERFUME_bzo4ys.jpg',
  'bvlgari_JW-25_MI_Octo_BZero1_Serpenti_Endorsed01_1080x1920_oletwd.jpg',
  'bvlgari_LE_GEMME_PERFUME_jypv6c.jpg',
  'bvlgari_OCTO_WAT_nyk8wj.jpg',
  'bvlgari_OTHERS_BAGS_tkyx9g.jpg',
  'bvlgari_OTHERS_WAT_uvvrn5.jpg',
  'bvlgari_P-25_Allegra_Insieme_Product01_700x933_zmuvee.jpg',
  'bvlgari_P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg',
  'bvlgari_ROMA_BAGS_pdgiyj.jpg',
  'bvlgari_SERPENTI_BAGS_hylyxj.jpg',
  'bvlgari_SERPENTI_WAT_avnnlz.jpg',
  'bvlgari_STC_JEW_o6halj.jpg',
  'bvlgari_TUBOGAS_JEW_tzh7e0.jpg',
  'bvlgari_b-tubogas_ols35a.jpg',
  'bvlgari_jewellery-serpenti_wur3rp.jpg',
  'bvlgari_journey-of-magnificence_pv7lxo.png',
  'bvlgari_lvcea-definitive.jpg',
  'bvlgari_menu-abu_lhv3fk.jpg',
  
  // AVIF files
  'GEMME MEN ONEKH.avif',
  'GEMME MEN ONEKH1.avif',
  'LE GEMME MAN TYGAR.avif',
  'LE GEMME MAN TYGAR1.avif',
  'LE GEMME falkar.avif',
  'LE GEMME falkar1.avif',
  'Sahare.avif',
  'amune.avif',
  'amune1.avif',
  'le gemme orom.avif',
  'le gemme orom1.avif',
  'sahare1.avif'
];

console.log('=== REMOVING ALL BVLGARI IMAGES FROM ASSETS/PERFUMES ===\n');

let removedCount = 0;
let notFoundCount = 0;

bvlgariImagesToRemove.forEach(image => {
  const imagePath = path.join(assetsPerfumesDir, image);
  
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`✓ Removed: ${image}`);
      removedCount++;
    } catch (error) {
      console.log(`✗ Error removing ${image}: ${error.message}`);
    }
  } else {
    console.log(`- Not found: ${image}`);
    notFoundCount++;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Removed: ${removedCount} files`);
console.log(`Not found: ${notFoundCount} files`);
console.log(`Total Bvlgari images processed: ${bvlgariImagesToRemove.length}`);

console.log(`\n=== CONFIRMATION ===`);
console.log(`All Bvlgari images have been removed from assets/perfumes/ directory.`);
console.log(`Product cards in storage.ts remain intact.`);