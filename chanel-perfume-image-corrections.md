# Chanel Perfume Image Matching Corrections

After analyzing the Chanel perfume catalog in the processed-perfumes-updated.json file, I've identified several image matching issues that need to be corrected. The main problems include:

1. **Cross-contamination of images between different product variants**
2. **Using COLOGNE photos on EDT perfumes and vice versa**
3. **Incorrectly using Blanche edition images for different products**
4. **Mixing images from different product lines in single product entries**

## Identified Issues and Corrections

### ALLURE HOMME (EDT)
- **Issue**: Contains images from multiple product lines including Blanche edition and Sport variants
- **Correction**: Should only contain images specific to ALLURE HOMME EDT

### ALLURE HOMME EDITION BLANCHE (EDP)
- **Issue**: Correct images are mostly in place, but need to ensure consistency across all volumes

### ALLURE HOMME SPORT
- **Issue**: Some entries incorrectly labeled as COLOGNE when they should be EDT, and vice versa
- **Issue**: Contains mixed images from different concentrations
- **Correction**: Separate images by product type (COLOGNE vs EDT vs EDP)

### ALLURE HOMME SPORT EAU EXTREME (EDP)
- **Issue**: Generally correct but needs verification of consistency

### CHANCE Line
- **Issue**: EDT and EDP variants incorrectly sharing images
- **Correction**: Separate image sets for each concentration type

## Detailed Corrections Needed

### 1. ALLURE HOMME (EDT 150ml) - ID: 100
**Current Issues**:
- Contains Blanche edition images: `1-allure-homme-edition-blanche-eau-de-parfum-spray-3-4fl-oz--packshot-default-127460-9564893642782.avif`
- Contains Sport line images: `1-allure-homme-sport-cologne-3-4fl-oz--packshot-default-123320-9564892692510.avif`, etc.

**Correction**:
- Keep only: `1-allure-homme-eau-de-toilette-spray-3-4fl-oz--packshot-default-121460-9564890333214.avif`
- Remove all images from other product lines

### 2. ALLURE HOMME EDITION BLANCHE (EDP) - IDs: 101, 102, 103
**Status**: Images appear to be correctly assigned

### 3. ALLURE HOMME SPORT - IDs: 104, 105, 106, 107
**Current Issues**:
- ID 104 (50ml) correctly labeled as EDT but contains EDP images
- IDs 105, 106, 107 (100ml, 150ml, 50ml) labeled as COLOGNE but should be consistent

**Correction**:
- Verify product types and ensure image consistency within each type
- Separate COLOGNE and EDT images properly

### 4. ALLURE HOMME SPORT EAU EXTREME (EDP) - IDs: 108, 109, 110
**Status**: Images appear to be correctly assigned

### 5. CHANCE Line - Various IDs
**Current Issues**:
- EDT and EDP variants sharing the same images
- EAU FRAICHE and EAU TENDRE variants incorrectly mixed

**Correction**:
- Ensure each variant has its own distinct image set
- Separate EDT from EDP images

## Implementation Plan

1. Create distinct image sets for each product variant
2. Remove cross-contamination of images between product lines
3. Ensure product type (EDT/EDP/COLOGNE) matches the images used
4. Maintain consistency across different volumes of the same product

This will ensure that customers see accurate representations of each perfume variant and improve the overall shopping experience.