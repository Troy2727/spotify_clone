const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log function to track progress
function log(message) {
  console.log(`[Build Script] ${message}`);
}

// Main function
async function main() {
  try {
    log('Starting custom build process...');

    // Check Node.js version
    const nodeVersion = process.version;
    log(`Using Node.js version: ${nodeVersion}`);

    // Install dependencies
    log('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    log('Installing backend dependencies...');
    execSync('npm install --prefix backend', { stdio: 'inherit' });

    log('Installing frontend dependencies (including dev dependencies)...');
    execSync('npm install --prefix frontend --include=dev', { stdio: 'inherit' });

    // Explicitly install critical dependencies
    log('Installing critical dependencies for frontend build...');
    execSync('cd frontend && npm install vite@4.5.2 @vitejs/plugin-react@4.2.1 typescript@5.6.2 --save-dev', { stdio: 'inherit' });

    // Ensure vite is available globally for this build
    log('Making vite available globally for this build...');
    execSync('npm install -g vite@4.5.2', { stdio: 'inherit' });

    // Build backend
    log('Building backend...');
    execSync('npm run build --prefix backend', { stdio: 'inherit' });

    // Build frontend
    log('Building frontend...');
    execSync('cd frontend && node vercel-build.cjs', { stdio: 'inherit' });

    // Verify the build output exists
    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    if (fs.existsSync(distPath)) {
      log(`Build output verified at ${distPath}`);

      // Check for index.html
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        log('index.html found in build output');
      } else {
        log('WARNING: index.html not found in build output!');
      }
    } else {
      log('WARNING: Build output directory not found!');
    }

    log('Build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the main function
main();
