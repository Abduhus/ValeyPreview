# Railway Deployment Instructions for ValleyPreview

This document provides step-by-step instructions for deploying the ValleyPreview Perfume E-commerce Platform to Railway.

## Prerequisites

1. A Railway account (https://railway.app/)
2. Node.js installed (version 20 or higher)
3. Git installed
4. Railway CLI installed (`npm install -g @railway/cli`)

## Deployment Steps

### 1. Prepare Your Project

Make sure all required files are present:
- `start.sh` (Unix/Linux startup script)
- `railway.json` (Railway configuration)
- `package.json` (Project dependencies and scripts)
- `Dockerfile` (Container configuration)
- Source code in `server/`, `client/`, and `shared/` directories

### 2. Initialize Railway Project

```bash
# Navigate to your project directory
cd /path/to/valley-preview

# Login to Railway
railway login

# Initialize a new Railway project
railway init
```

### 3. Configure Environment Variables

Set the required environment variables in Railway:

```bash
# Set production environment
railway variables set NODE_ENV=production
```

### 4. Deploy to Railway

```bash
# Deploy your application
railway up
```

This command will:
1. Use the NIXPACKS builder (as specified in railway.json)
2. Execute `bash start.sh` as the start command
3. Automatically detect and expose the port
4. Run health checks on the `/` endpoint

## How It Works

### Environment Detection

The [start.sh](file:///C:/Games/ValleyPreview/start.sh) script automatically detects when it's running on Railway by checking for the `RAILWAY_ENVIRONMENT` environment variable.

### Build Process

1. Dependencies are installed using `npm ci` for faster, reproducible builds
2. The TypeScript compiler and Vite build the frontend and backend
3. Assets are optimized for production

### Start Process

1. Image optimization is skipped for faster deployment
2. The production server is started using `npm run start`
3. Server listens on the port specified by Railway (default: 5000)

## Monitoring and Logs

### View Application Logs

```bash
# View real-time logs
railway logs
```

### Health Checks

Railway automatically checks the `/health` endpoint which returns:
```json
{
  "status": "ok",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
  "uptime": 123.456,
  "environment": "production"
}
```

## Custom Domain (Optional)

To use a custom domain:

1. In the Railway dashboard, go to your project
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions provided

## Scaling

Railway automatically handles scaling. For manual control:

1. In the Railway dashboard, go to your project
2. Navigate to the Deployments tab
3. Adjust the instance count and size as needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are listed in package.json
   - Verify TypeScript compilation with `npm run check`
   - Review build logs in Railway dashboard

2. **Runtime Errors**
   - Check application logs with `railway logs`
   - Verify environment variables are set correctly
   - Test locally with `npm run start`

3. **Health Check Failures**
   - Ensure the server is listening on 0.0.0.0 (not 127.0.0.1)
   - Verify the `/health` endpoint returns a 200 status
   - Check that the PORT environment variable is being used

### Testing Locally

To simulate Railway deployment locally:

```bash
# Set Railway environment variables
export RAILWAY_ENVIRONMENT=production
export NODE_ENV=production

# Run the start script
bash start.sh
```

## Support

For issues with deployment:

1. Check the Railway documentation: https://docs.railway.app/
2. Review error logs in Railway dashboard
3. Verify all configuration files are present and correct
4. Contact Railway support if needed