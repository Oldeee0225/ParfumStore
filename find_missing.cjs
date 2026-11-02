const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');

const regex = /id:\s*\d+,\s*name:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const name = match[1];
  const startIdx = match.index;
  const endIdx = content.indexOf('}', startIdx);
  const block = content.substring(startIdx, endIdx);
  
  // ignore if it's a review (e.g. if block contains 'rating:' but no 'brand:')
  if (!block.includes('brand:')) continue;
  
  const imgMatch = block.match(/image:\s*([^,]+)/);
  if (imgMatch) {
    const imgVal = imgMatch[1].trim();
    if (imgVal.includes('placeholder') || imgVal.includes('undefined') || imgVal === '""' || imgVal === "''") {
       console.log(name, '->', imgVal);
    } else {
       // Just list all to see what they use
       // console.log(name, '->', imgVal);
    }
  } else {
    console.log(name, '-> NO IMAGE KEY');
  }
}
