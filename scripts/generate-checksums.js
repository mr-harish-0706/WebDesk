import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const releaseDir = path.join(__dirname, '../release/1.0.0');

if (!fs.existsSync(releaseDir)) {
  console.error(`Release directory ${releaseDir} does not exist. Run npm run build first.`);
  process.exit(1);
}

const files = fs.readdirSync(releaseDir);
const checksums = [];

for (const file of files) {
  const filePath = path.join(releaseDir, file);
  const stat = fs.statSync(filePath);

  if (stat.isFile() && (file.endsWith('.AppImage') || file.endsWith('.deb') || file.endsWith('.rpm') || file.endsWith('.exe') || file.endsWith('.dmg') || file.endsWith('.tar.gz'))) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');
    checksums.push(`${hex}  ${file}`);
    console.log(`Computed SHA256 for ${file}: ${hex.substring(0, 16)}...`);
  }
}

const outputFile = path.join(releaseDir, 'SHA256SUMS.txt');
fs.writeFileSync(outputFile, checksums.join('\n') + '\n', 'utf-8');
console.log(`\nSuccessfully wrote SHA256SUMS.txt to ${outputFile}`);
