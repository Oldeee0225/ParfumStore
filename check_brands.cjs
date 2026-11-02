const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const match = content.match(/export const BRANDS(.*?)$/s);
if (match) {
  const lines = match[0].split('\n');
  lines.forEach(line => {
    if (line.includes('image: ""') || line.includes("image: ''") || (line.includes('name:') && !line.includes('image:'))) {
      console.log(line);
    }
  });
}
