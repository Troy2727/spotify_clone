// This is a custom build script for Vercel deployment
import { execSync } from 'child_process';

console.log('Starting Vercel build process...');

// Run the Vite build using the local installation
try {
  console.log('Building with local Vite installation...');
  execSync('node ./node_modules/vite/bin/vite.js build', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
