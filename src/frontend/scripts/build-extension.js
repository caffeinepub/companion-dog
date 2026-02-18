const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, '../dist-extension');
const outputZip = path.join(__dirname, '../companion-dog-extension.zip');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(
  path.join(__dirname, '../public/manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy assets
const assetsDir = path.join(__dirname, '../public/assets/generated');
const distAssetsDir = path.join(distDir, 'assets/generated');
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

fs.readdirSync(assetsDir).forEach(file => {
  fs.copyFileSync(
    path.join(assetsDir, file),
    path.join(distAssetsDir, file)
  );
});

// Note: In production, you would bundle content.tsx to content.js here
// For now, we'll create a placeholder
fs.writeFileSync(
  path.join(distDir, 'content.js'),
  '// Content script bundle would go here\nconsole.log("Companion Dog Extension Loaded");'
);

// Create zip file
const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Extension packaged: ${archive.pointer()} bytes`);
  console.log(`Output: ${outputZip}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
