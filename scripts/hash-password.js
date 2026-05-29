#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pw = process.argv[2];

if (!pw) {
  console.log('Usage: node scripts/hash-password.js "your-admin-password"');
  console.log('');
  console.log('This will output:');
  console.log('  1. ADMIN_PASSWORD_HASH — paste into Vercel env vars');
  console.log('  2. JWT_SECRET — a random 48-char string for JWT signing');
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 10);
const jwtSecret = crypto.randomBytes(36).toString('base64');

console.log('');
console.log('Add these to Vercel Environment Variables');
console.log('(Settings → Environment Variables — for Production, Preview, Development):');
console.log('');
console.log('ADMIN_PASSWORD_HASH=' + hash);
console.log('JWT_SECRET=' + jwtSecret);
console.log('');
console.log('Plus these (you already have your token from GitHub):');
console.log('GITHUB_TOKEN=ghp_... (your Personal Access Token)');
console.log('GITHUB_REPO=v1-coder-max/Fine-Leg-Talk');
console.log('GITHUB_BRANCH=main');
console.log('');
