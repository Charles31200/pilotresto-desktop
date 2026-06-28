/**
 * Converts assets/icon.png → assets/icon.ico
 * Usage : node scripts/convert-icon.js
 * Requires: png2icons (already in devDependencies)
 */

const fs   = require('fs')
const path = require('path')

const assetsDir = path.join(__dirname, '..', 'assets')
const destIco   = path.join(assetsDir, 'icon.ico')

// Préférence : icon.png, fallback icon-256.png
const candidates = ['icon.png', 'icon-256.png']
const srcPng = candidates.map(f => path.join(assetsDir, f)).find(fs.existsSync)

if (!srcPng) {
  console.error(`Source PNG not found. Expected one of: ${candidates.join(', ')} in assets/`)
  process.exit(1)
}

let png2icons
try {
  png2icons = require('png2icons')
} catch {
  console.error('png2icons not installed. Run: npm install --save-dev png2icons')
  process.exit(1)
}

const input = fs.readFileSync(srcPng)
const ico   = png2icons.createICO(input, png2icons.BILINEAR, 0, true, true)

if (!ico) {
  console.error('Conversion failed: createICO returned null')
  process.exit(1)
}

fs.writeFileSync(destIco, ico)
console.log(`✓ ${path.basename(srcPng)} → ${destIco}`)
