# Railway Deployment Guide for ValleyPreview Perfume E-commerce Platform

This guide will help you deploy the ValleyPreview Perfume E-commerce Platform to Railway.

## Prerequisites

1. A Railway account (https://railway.app/)
2. The Railway CLI installed (`npm install -g @railway/cli`)

## Deployment Steps

### 1. Connect to Railway

```bash
railway login
```

### 2. Initialize Your Project

Navigate to your project directory and initialize:

```bash
cd /path/to/valley-preview
railway init
```

### 3. Configure Environment Variables

Set the required environment variables:

```bash
railway variables set NODE_ENV=production
```

### 4. Deploy to Railway

Deploy your application:

```bash
railway up
```

## How the Deployment Works

### Start Script

The [start.sh](file:///C:/Games/ValleyPreview/start.sh) script handles different deployment scenarios:

1. **On Railway**: Automatically detects Railway environment and runs in production mode
2. **Local Development**: Runs in development mode with hot reloading
3. **Local Production**: Can be run locally in production mode

### Build Process

1. Dependencies are installed using `npm ci` for faster, reproducible builds (with fallback to `npm install`)
2. TypeScript compilation and Vite build process creates optimized assets
3. Images are converted to WebP format for better performance (skipped on Railway for speed)

### Health Checks

Railway will automatically check the `/health` endpoint to verify the application is running.

## Environment Variables

Key environment variables used:

- `NODE_ENV`: Set to "production" on Railway
- `PORT`: Railway provides this automatically (defaults to 5000)
- `RAILWAY_ENVIRONMENT`: Used to detect Railway environment

## Custom Domain (Optional)

To use a custom domain:

1. Go to your Railway project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs in Railway dashboard
2. **Runtime Errors**: Check application logs in Railway dashboard
3. **Port Issues**: Ensure application listens on the port specified by `PORT` environment variable
4. **Dependency Issues**: Version mismatches between package.json and package-lock.json

### Dependency Issues (package-lock.json problems)

If you encounter errors like:
```
npm error Invalid: lock file's package@version does not satisfy package@version
```

This indicates that your package.json and package-lock.json are out of sync. To fix this:

1. Run the fix script:
   ```bash
   node fix-lock-file.js
   ```

2. Or manually fix by:
   ```bash
   # Remove node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Reinstall dependencies
   npm install
   
   # Commit the new package-lock.json
   git add package-lock.json
   git commit -m "Update package-lock.json"
   ```

3. Then redeploy:
   ```bash
   railway up
   ```

### Debugging Locally

To test the Railway deployment process locally:

```bash
# Set Railway environment variables
export RAILWAY_ENVIRONMENT=production

# Run the start script with sh (not bash) for compatibility
sh start.sh
```

## Performance Optimization

1. **Image Optimization**: Images are automatically converted to WebP format
2. **Asset Minification**: Vite handles CSS and JavaScript minification
3. **Caching**: Express.js includes basic caching headers

## Scaling

Railway automatically handles scaling based on your usage. For manual scaling:

1. Go to your Railway project dashboard
2. Navigate to the Deployments tab
3. Adjust the instance count and size as needed

## Monitoring

Railway provides built-in monitoring:

1. **Logs**: Real-time application logs
2. **Metrics**: CPU, memory, and network usage
3. **Health Checks**: Automatic health verification

## Updating Your Deployment

To update your deployed application:

1. Make your changes locally
2. Commit to git
3. Run `railway up` to deploy the new version

## Support

For issues with the ValleyPreview platform:
- Check the project documentation
- Review error logs in Railway dashboard
- Contact support if needed