import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.resolve(__dirname, 'dist');
const pub = path.resolve(__dirname, 'public');
const src = path.resolve(__dirname, 'src');

console.log('📦 Copying extension files...');

// Ensure dist exists
if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
}

// Copy manifest
const manifestSrc = path.join(pub, 'manifest.json');
const manifestDest = path.join(dist, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDest);
    console.log('✓ manifest.json');
} else {
    console.error('✗ manifest.json not found');
}

// Copy icons
['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
    const iconSrc = path.join(pub, icon);
    const iconDest = path.join(dist, icon);
    if (fs.existsSync(iconSrc)) {
        fs.copyFileSync(iconSrc, iconDest);
        console.log(`✓ ${icon}`);
    } else {
        console.warn(`⚠ ${icon} not found`);
    }
});

// Copy content script
const contentSrc = path.join(src, 'content.js');
const contentDest = path.join(dist, 'content.js');
if (fs.existsSync(contentSrc)) {
    fs.copyFileSync(contentSrc, contentDest);
    console.log('✓ content.js');
} else {
    console.error('✗ content.js not found');
}

// Copy background script
const backgroundSrc = path.join(src, 'background.js');
const backgroundDest = path.join(dist, 'background.js');
if (fs.existsSync(backgroundSrc)) {
    fs.copyFileSync(backgroundSrc, backgroundDest);
    console.log('✓ background.js');
} else {
    console.error('✗ background.js not found');
}

console.log('\n✅ Extension files copied to dist/');
console.log('\nFiles in dist/:');
fs.readdirSync(dist).forEach(file => {
    console.log(`  - ${file}`);
});