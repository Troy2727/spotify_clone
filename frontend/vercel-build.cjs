// This is a custom build script for Vercel deployment (CommonJS version)
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vercel build process (CJS)...');

// Run the Vite build using the local installation
try {
  console.log('Building with local Vite installation...');
  
  // Check if vite exists in node_modules
  const vitePath = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  if (fs.existsSync(vitePath)) {
    console.log(`Found Vite at: ${vitePath}`);
  } else {
    console.log('Vite not found in node_modules, installing...');
    execSync('npm install vite@4.5.2 @vitejs/plugin-react@4.2.1 --save-dev', { 
      stdio: 'inherit',
      cwd: process.cwd() 
    });
  }
  
  // Run the build command
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
