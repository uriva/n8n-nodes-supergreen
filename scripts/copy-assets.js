const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists && (src.endsWith('.svg') || src.endsWith('.png') || src.endsWith('.json'))) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(path.join(__dirname, '../nodes'), path.join(__dirname, '../dist/nodes'));
copyRecursiveSync(path.join(__dirname, '../credentials'), path.join(__dirname, '../dist/credentials'));
console.log('Assets copied to dist/');
