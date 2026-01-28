# GitHub Actions Migration

This document describes the migration from GitLab CI/CD to GitHub Actions.

## Overview

The GitLab CI/CD pipeline has been successfully migrated to GitHub Actions. The new workflow maintains the same functionality:

- **Build artifacts** for web (Next.js) and service (Elysia API) applications
- **Build Docker images** for both applications
- **Push images to AWS ECR** on tags and main branch

## Workflow File

- **Location**: `.github/workflows/ci-cd.yml`
- **Triggers**:
  - Push to any branch
  - Push tags
  - Pull requests to main (builds artifacts only, no Docker images or ECR uploads)

## Jobs

### 1. Setup Environment
Sets environment variables based on the trigger:
- **Pull Requests**: Staging environment, version = pr-{number}-{sha}, upload disabled
- **Tags**: Production environment, version = tag name, upload enabled
- **Main branch**: Staging environment, version = main-{sha}, upload enabled  
- **Other branches**: Staging environment, version = branch-{sha}, upload disabled

### 2. Build Web Artifact
- Installs dependencies with Bun
- Builds the Next.js web application
- Uploads `.next` directory as artifact

### 3. Build Service Artifact
- Installs dependencies with Bun
- Builds the Elysia service application
- Uploads `dist` directory as artifact

### 4. Build Web Image
- Downloads web artifact
- Builds Docker image using `docker/Dockerfile.app.web`
- Saves and uploads Docker image as artifact
- **Only runs on tags and main branch**

### 5. Build Service Image
- Downloads service artifact
- Builds Docker image using `docker/Dockerfile.app.service`
- Saves and uploads Docker image as artifact
- **Only runs on tags and main branch**

### 6. Upload Web Image
- Downloads Docker image artifact
- Configures AWS credentials
- Logs in to AWS ECR
- Tags and pushes image to ECR
- Cleans up images
- **Only runs on tags and main branch**

### 7. Upload Service Image
- Downloads Docker image artifact
- Configures AWS credentials
- Logs in to AWS ECR
- Tags and pushes image to ECR
- Cleans up images
- **Only runs on tags and main branch**

## Required GitHub Secrets

The following secrets must be configured in the GitHub repository settings:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID for ECR authentication |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key for ECR authentication |
| `AWS_REGION` | AWS region where ECR repository is located |
| `AWS_ECR_REPOSITORY` | Name of the ECR repository |

### Setting up Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the required secrets listed above

## Differences from GitLab CI

### Advantages of GitHub Actions:
- Native integration with GitHub
- Better caching mechanism with `actions/cache`
- More mature marketplace with official AWS actions
- Built-in artifact management with retention policies
- Simplified pull request testing

### Key Changes:
1. **Caching**: Uses GitHub Actions cache instead of GitLab cache
2. **Artifacts**: Uses GitHub Actions artifacts with 1-day retention
3. **AWS Integration**: Uses official AWS actions for ECR login
4. **Conditional Execution**: Uses `if` conditions instead of GitLab rules
5. **Job Dependencies**: Uses `needs` instead of stage ordering
6. **Docker Build**: Removed Docker Buildx setup (not needed for simple builds)
7. **Pull Requests**: Explicitly handled with proper version naming

## Legacy Files

The following GitLab CI files are no longer needed but kept for reference:
- `.gitlab-ci.yml`
- `.gitlab/base.yml`

These can be removed once the GitHub Actions workflow is verified to work correctly.

## Testing the Workflow

To test the workflow:

1. **Pull request builds**: Open a PR - builds artifacts only, no Docker images
2. **Branch builds**: Push to any branch - builds artifacts only, no Docker images
3. **Main branch**: Push to main - builds artifacts, images, and uploads to ECR
4. **Release**: Create and push a tag - builds and uploads with production environment

## Troubleshooting

If the workflow fails:

1. Check that all required secrets are configured correctly
2. Verify AWS credentials have permission to push to ECR
3. Ensure ECR repository exists and is accessible
4. Check job logs in the Actions tab for specific error messages
