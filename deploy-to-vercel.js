#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 LogiTrack Pro - Vercel Deployment Helper\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ Vercel CLI is not installed. Installing now...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully!');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install it manually with: npm install -g vercel');
    process.exit(1);
  }
}

// Check if .env.example exists and if .env exists
const envExamplePath = path.join(process.cwd(), '.env.example');
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found. Please make sure it exists.');
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  console.log('⚠️ No .env file found. You should create one before deploying.');
  rl.question('Do you want to create a .env file from .env.example? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env file from .env.example. Please edit it with your actual values.');
      console.log('📝 After editing your .env file, run this script again.');
      rl.close();
      process.exit(0);
    } else {
      proceedWithDeployment();
    }
  });
} else {
  proceedWithDeployment();
}

function proceedWithDeployment() {
  console.log('\n📋 Deployment Checklist:');
  console.log('1. Make sure your database is set up and accessible from the internet');
  console.log('2. Ensure all environment variables are configured');
  console.log('3. Commit all your changes to git');
  
  rl.question('\nAre you ready to deploy to Vercel? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\n🚀 Starting deployment to Vercel...');
      try {
        // Run Vercel CLI
        execSync('vercel', { stdio: 'inherit' });
        console.log('\n✅ Deployment initiated! Follow the instructions in the Vercel CLI.');
      } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
      }
    } else {
      console.log('\n❌ Deployment cancelled.');
    }
    rl.close();
  });
}