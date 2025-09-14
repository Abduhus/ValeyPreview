# ValleyPreview Perfume E-commerce Platform - Deployment Summary

This document summarizes the deployment configuration for the ValleyPreview Perfume E-commerce Platform, specifically for deployment to Railway.

## Deployment Configuration

### 1. Start Scripts

Two start scripts are provided for cross-platform compatibility:

1. **[start.sh](file:///C:/Games/ValleyPreview/start.sh)** - Unix/Linux/macOS script for Railway deployment
2. **[start.bat](file:///C:/Games/ValleyPreview/start.bat)** - Windows script for local development

Both scripts automatically detect the environment and configure the application accordingly.

### 2. Railway Configuration

The **[railway.json](file:///C:/Games/ValleyPreview/railway.json)** file configures:
- Build strategy: NIXPACKS
- Start command: `npm run start`
- Health check path: `/`
- Environment-specific settings for production and development

### 3. Docker Support

The **[Dockerfile](file:///C:/Games/ValleyPreview/Dockerfile)** provides containerization support with:
- Multi-stage build for optimal image size
- WebP tools installation for image optimization
- Health check endpoint configuration
- Proper port exposure for Railway compatibility

### 4. Package.json Scripts

Enhanced npm scripts for deployment:
- `npm run deploy` - Runs the start.sh script
- `npm run deploy:setup` - Runs the PowerShell setup script
- `npm run start:windows` - Runs the Windows start script
- `npm run railway:deploy` - Deploys to Railway (requires Railway CLI)
- `npm run railway:logs` - Shows Railway logs (requires Railway CLI)

## Deployment Process

### For Railway Deployment:

1. Install the Railway CLI:
   ```
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```
   railway login
   ```

3. Initialize your project:
   ```
   railway init
   ```

4. Deploy to Railway:
   ```
   railway up
   ```

### For Local Development:

1. Run in development mode:
   ```
   npm run dev
   ```

2. Or use the start script:
   ```
   # On Unix/Linux/macOS:
   sh start.sh
   
   # On Windows:
   start.bat
   ```

## Key Features

### Environment Detection
The start scripts automatically detect:
- Railway environment (using `RAILWAY_ENVIRONMENT` or `RAILWAY_PROJECT_ID`)
- Local development vs production mode (using `NODE_ENV`)

### Image Optimization
- Automatic WebP conversion for better performance
- Skipped on Railway for faster deployment
- Can be run locally for development

### Build Process
- TypeScript compilation with `tsc`
- Vite build for optimized frontend assets
- Production builds use `npm ci` for faster, reproducible builds

### Health Monitoring
- `/health` endpoint for Railway health checks
- Automatic uptime and status reporting
- Error logging and monitoring

## Environment Variables

Important environment variables:
- `NODE_ENV` - "development" or "production"
- `PORT` - Server port (Railway provides automatically)
- `RAILWAY_ENVIRONMENT` - Set by Railway for environment detection

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check dependencies in package.json
   - Verify TypeScript compilation with `npm run check`
   - Review Railway logs with `railway logs`

2. **Runtime Errors**
   - Check application logs in Railway dashboard
   - Verify environment variables are set correctly
   - Test locally with `npm run start`

3. **Permission Issues**
   - Ensure start.sh is executable (`chmod +x start.sh`)
   - On Windows, the PowerShell setup script handles permissions

### Testing Deployment Locally

To simulate Railway deployment locally:
```bash
export RAILWAY_ENVIRONMENT=production
sh start.sh
```

## Support

For deployment issues:
1. Check the [RAILWAY_DEPLOYMENT_GUIDE.md](file:///C:/Games/ValleyPreview/RAILWAY_DEPLOYMENT_GUIDE.md) for detailed instructions
2. Review error logs in Railway dashboard
3. Verify all configuration files are present and correct
4. Contact support if needed