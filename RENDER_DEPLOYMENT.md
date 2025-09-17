# Deploying ValleyPreview to Render

This guide explains how to deploy the ValleyPreview perfume e-commerce platform to Render.

## Prerequisites

1. A Render account (https://render.com)
2. This repository connected to Render

## Deployment Steps

1. **Create a new Web Service on Render**
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect your repository

2. **Configure the Web Service**
   - **Name**: ValleyPreview (or any name you prefer)
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `node render-entry.js`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `PORT`: 10000

3. **Advanced Settings**
   - **Instance Type**: Free or Standard (based on your needs)
   - **Auto-Deploy**: Yes (recommended)

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically start building and deploying your application

## Environment Variables

The following environment variables are used:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 10000 |

## Health Check Endpoints

The application provides health check endpoints:

- `/health` - General health check
- `/render/health` - Render-specific health check
- `/` - Root endpoint with status information

## Troubleshooting

If your deployment fails:

1. Check the build logs in the Render dashboard
2. Ensure all dependencies are correctly listed in package.json
3. Verify the build command completes successfully
4. Check that the start command references the correct entry point

## Custom Domain

To use a custom domain:

1. In your Render dashboard, go to your web service
2. Click "Settings" → "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

## Support

For issues with deployment, please check:
- Render documentation: https://render.com/docs
- This project's documentation
- Contact the development team