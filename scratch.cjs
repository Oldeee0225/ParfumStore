const fs = require('fs');

const content = fs.readFileSync('./src/data/products.ts', 'utf8');

const brandRegex = /brand:\s*['"]([^'"]+)['"]/g;
let match;
const productsBrands = new Set();
while ((match = brandRegex.exec(content)) !== null) {
  productsBrands.add(match[1]);
}

const brandsArrayMatch = content.match(/export const BRANDS = \[\s*([\s\S]*?)\s*\]/);
const brandsBrands = new Set();
if (brandsArrayMatch) {
  const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
  let nameMatch;
  while ((nameMatch = nameRegex.exec(brandsArrayMatch[1])) !== null) {
    brandsBrands.add(nameMatch[1]);
  }
}

const missing = [];
for (const b of productsBrands) {
  if (!brandsBrands.has(b)) {
    missing.push(b);
  }
}

console.log('Missing from BRANDS:', missing);
