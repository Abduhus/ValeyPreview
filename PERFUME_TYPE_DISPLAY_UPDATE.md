# Perfume Type Display Update

## Summary
This update modifies the product card component to display the perfume type (EDT, EDP, Cologne, etc.) instead of fragrance notes, while preserving the fragrance notes on the product detail page.

## Changes Made

### 1. Product Card Component (`client/src/components/product-card.tsx`)
- Replaced the "FRAGRANCE NOTES" section with a "PERFUME TYPE" section
- Added display of the `selectedSize.type` value
- Maintained consistent styling with the previous design

### Code Changes:
```typescript
{/* Perfume Type Display */}
<div className="mb-4 p-3 bg-gradient-to-r from-card/60 via-background/40 to-card/60 border border-primary/20 rounded-lg backdrop-blur-sm">
  <h4 className="text-xs font-semibold text-primary mb-2">PERFUME TYPE</h4>
  <div className="flex flex-wrap gap-2">
    <span className="text-sm font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">
      {selectedSize.type || 'N/A'}
    </span>
  </div>
</div>
```

### 2. Product Detail Page (`client/src/pages/product-detail.tsx`)
- Preserved the complete "Fragrance Notes" section
- No changes made to maintain the detailed fragrance information on the product page

## Data Structure
The product data already contains a `type` field with appropriate values:
```json
{
  "id": "100",
  "name": "ALLURE HOMME",
  "brand": "CHANEL",
  "type": "EDT",
  // ... other fields
}
```

## Verification
- Product cards now display perfume type instead of fragrance notes
- Product detail pages continue to show complete fragrance notes
- All styling and layout remain consistent with the previous design
