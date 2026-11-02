const fs = require('fs');

const content = fs.readFileSync('./src/data/products.ts', 'utf8');

const brandRegex = /brand:\s*['"]([^'"]+)['"]/g;
let match;
const productsBrands = {};
while ((match = brandRegex.exec(content)) !== null) {
  const brand = match[1];
  productsBrands[brand] = (productsBrands[brand] || 0) + 1;
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
for (const b of Object.keys(productsBrands)) {
  if (!brandsBrands.has(b)) {
    missing.push({
      name: b,
      country: 'Desconocido', // We can set manually later if we want
      count: productsBrands[b],
      letter: b.charAt(0).toUpperCase(),
      image: ''
    });
  }
}

let newLines = '';
for (const m of missing) {
  newLines += `  { name: '${m.name}', country: 'Desconocido', count: ${m.count}, letter: '${m.letter}', image: '' },\n`;
}

console.log(newLines);
