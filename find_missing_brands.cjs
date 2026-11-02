const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');

const regex = /name:\s*['"]([^'"]+)['"],\s*country:\s*['"][^'"]+['"],\s*image:\s*([^,}]+)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const name = match[1];
  const image = match[2].trim();
  if (image === '""' || image === "''" || image.includes('placeholder') || image === 'undefined' || image === 'null' || !image) {
    console.log('Brand missing image:', name, '->', image);
  }
}
