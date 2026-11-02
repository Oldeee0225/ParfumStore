const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const regex = /id:\s*(\d+),\s*name:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  if (match[2].toLowerCase().includes('sauvage') || match[2].toLowerCase().includes('elixir')) {
    console.log(match[1], match[2]);
  }
}
