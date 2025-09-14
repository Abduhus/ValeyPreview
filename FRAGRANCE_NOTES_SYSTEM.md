# Fragrance Notes System Documentation

## Overview
This document describes the fragrance notes system that has been implemented in the ValleyPreview application. The system allows for authentic fragrance notes to be displayed for each perfume product, enhancing the user experience with detailed olfactory information.

## System Components

### 1. Database Schema Changes
The product schema has been extended to include three new fields:
- `topNotes`: String containing comma-separated top notes
- `middleNotes`: String containing comma-separated middle/heart notes
- `baseNotes`: String containing comma-separated base notes

### 2. Data Structure
Each note field contains a comma-separated list of fragrance notes:
```javascript
{
  topNotes: "Bergamot, Lemon, Pink Pepper",
  middleNotes: "Rose, Jasmine, Geranium",
  baseNotes: "Sandalwood, Musk, Amber"
}
```

### 3. Display Logic
The system uses the following logic to display fragrance notes:
1. If authentic notes are available in the database, they are displayed
2. If no authentic notes are available, the system generates notes algorithmically based on product name keywords

## Implementation Files

### Frontend Components
1. **Product Detail Page** (`client/src/pages/product-detail.tsx`)
   - Displays detailed fragrance notes in a structured format
   - Shows top, middle, and base notes in separate sections
   - Uses color coding for different note types

2. **Product Card** (`client/src/components/product-card.tsx`)
   - Displays a preview of fragrance notes in a compact format
   - Shows a limited number of notes with "+X more" indicator

### Backend
1. **Storage System** (`server/storage.ts`)
   - Extended product objects with fragrance note fields
   - Includes authentic notes for select products

2. **Schema Definition** (`shared/schema.ts`)
   - Updated TypeScript types to include fragrance note fields
   - Added optional fields to maintain backward compatibility

## Adding Fragrance Notes

### Method 1: Manual Update
To add fragrance notes to a product in `storage.ts`:

```javascript
{
  id: "123",
  name: "Perfume Name",
  // ... other fields
  topNotes: "Bergamot, Lemon, Pink Pepper",
  middleNotes: "Rose, Jasmine, Geranium",
  baseNotes: "Sandalwood, Musk, Amber"
}
```

### Method 2: Automated Update
Use the provided scripts to batch update products:

1. **Data File**: Update `fragrance-notes-data.json` with product information
2. **Update Script**: Run `node update-fragrance-notes.cjs` to apply changes

## Scraping Fragrance Notes

### Fragrantica Scraper
The project includes a conceptual scraper (`scrape-fragrantica-notes.js`) for extracting authentic fragrance notes from Fragrantica.com. 

**Important Notes:**
- This is a conceptual implementation only
- Actual implementation would require proper web scraping tools
- Always respect website terms of service
- Consider rate limiting and anti-bot measures

## Future Enhancements

### 1. Admin Interface
- Create a CMS for managing fragrance notes
- Allow non-technical users to update notes
- Include validation and preview features

### 2. Enhanced Display
- Add note descriptions and categories
- Include note intensity indicators
- Add visual representations of note evolution

### 3. Search and Filtering
- Enable filtering by specific notes
- Add note-based product recommendations
- Implement note comparison features

## Best Practices

### Data Quality
1. Use authentic notes from reputable sources (Fragrantica, Basenotes, etc.)
2. Maintain consistency in note naming
3. Verify accuracy of note information

### Performance
1. Cache note data when possible
2. Optimize note parsing for large datasets
3. Implement lazy loading for note details

### User Experience
1. Provide clear visual distinction between note types
2. Include tooltips or descriptions for unfamiliar notes
3. Ensure mobile-friendly note display

## Troubleshooting

### Common Issues
1. **Missing Notes**: Check if product has note fields populated
2. **Display Issues**: Verify note parsing logic in components
3. **Update Problems**: Ensure data file format matches expected structure

### Debugging Steps
1. Check browser console for errors
2. Verify product data in storage.ts
3. Confirm component props are correctly passed