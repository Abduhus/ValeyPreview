# Deployment Checklist for ValleyPreview Perfume E-commerce

## Pre-Deployment Checklist

### 1. Code Changes Verification
- [x] Product images are loading correctly in ProductCard components
- [x] Asset paths in product data match actual file locations
- [x] Build process correctly copies all asset directories
- [x] Server starts successfully in production mode
- [x] Health check endpoints are accessible
- [x] Static assets are served correctly

### 2. Configuration Files
- [x] `package.json` - Build script includes asset copying
- [x] `render.json` - Correct build and start commands
- [x] `render-entry.mjs` - Proper server startup process
- [x] `copy-assets.js` - Asset copying script is present
- [x] `tsconfig.server.json` - Server build configuration

### 3. Asset Structure
- [x] `assets/perfumes/chanel/` directory exists with image files
- [x] `assets/perfumes/bvlgari/` directory exists with image files
- [x] All product image references point to correct locations
- [x] Build process copies perfumes directory to `dist/public/assets/perfumes/`

## Deployment Steps

### 1. Push Changes to GitHub
```bash
git add .
git commit -m "Fix product image loading issue - copy perfumes assets during build"
git push origin main
```

### 2. Trigger Render Deployment
- Go to Render dashboard
- Find the ValleyPreview service
- Trigger a new deployment manually if auto-deploy doesn't start

### 3. Monitor Deployment
- Watch build logs for any errors
- Verify asset copying step completes successfully
- Check deployment logs for server startup

### 4. Post-Deployment Verification
- [ ] Visit https://valeypreview-2.onrender.com/catalog
- [ ] Verify product images are visible
- [ ] Check individual product pages
- [ ] Test health check endpoints:
  - https://valeypreview-2.onrender.com/health
  - https://valeypreview-2.onrender.com/render/health
- [ ] Verify direct image access:
  - https://valeypreview-2.onrender.com/assets/perfumes/chanel/1-allure-homme-eau-de-toilette-spray-3-4fl-oz--packshot-default-121460-9564890333214.avif

## Troubleshooting

### If Images Still Don't Load
1. Check Render build logs for asset copying step
2. Verify `dist/public/assets/perfumes/` directory exists after build
3. Check server logs for static file serving
4. Test direct image URLs in browser

### If Server Fails to Start
1. Check Render deployment logs
2. Verify `render-entry.mjs` is correctly configured
3. Ensure all environment variables are set
4. Check for TypeScript compilation errors

### If Build Fails
1. Verify `package.json` build script
2. Check `copy-assets.js` script for errors
3. Ensure all required dependencies are installed
4. Verify directory permissions

## Rollback Plan
If issues persist after deployment:
1. Revert to previous working commit
2. Restore `render.json` to previous configuration
3. Contact Render support if infrastructure issues

## Success Criteria
- [ ] Product images visible on catalog page
- [ ] Individual product pages load correctly
- [ ] Health checks return 200 OK
- [ ] Direct image URLs return 200 OK
- [ ] No console errors in browser developer tools
- [ ] No server errors in Render logs