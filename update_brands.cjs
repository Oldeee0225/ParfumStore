const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');

const brandImports = `
import imgParfumsMarly from '../assets/Marcas/ParfumsMarly.png'
import imgSospiro from '../assets/Marcas/Sospiro.png'
import imgBornToStandOut from '../assets/Marcas/Borntostandout.png'
import imgTomFord from '../assets/Marcas/TomFord.png'
import imgLorenzoPazzaglia from '../assets/Marcas/LorenzoPazzaglia.png'
import imgJoMilano from '../assets/Marcas/JoMilano.png'
import imgMatierePremiere from '../assets/Marcas/MatierePremiere.png'
import imgRabanne from '../assets/Marcas/PacoRabanne.jpg'
import imgMichaelMalul from '../assets/Marcas/MichaelMalul.png'
import imgChanel from '../assets/Marcas/Chanel.png'
import imgOrtoParisi from '../assets/Marcas/OrtoParisi.png'
`;

// Insert the new brand imports before the BRANDS array definition
let newContent = content.replace('export const BRANDS = [', brandImports + '\nexport const BRANDS = [');

const replacements = [
  ['Parfums de Marly', 'imgParfumsMarly'],
  ['Sospiro', 'imgSospiro'],
  ['BornToStandOut', 'imgBornToStandOut'],
  ['Tom Ford', 'imgTomFord'],
  ['Lorenzo Pazzaglia', 'imgLorenzoPazzaglia'],
  ['Jo Milano', 'imgJoMilano'],
  ['Matiere Premiere', 'imgMatierePremiere'],
  ['Rabanne', 'imgRabanne'],
  ['Michael Malul', 'imgMichaelMalul'],
  ['Chanel', 'imgChanel'],
  ['Orto Parisi', 'imgOrtoParisi']
];

let brandsArrayStartIdx = newContent.indexOf('export const BRANDS = [');
if (brandsArrayStartIdx !== -1) {
  let beforeBrands = newContent.substring(0, brandsArrayStartIdx);
  let afterBrands = newContent.substring(brandsArrayStartIdx);

  for (const [name, imgVar] of replacements) {
    const reg = new RegExp("(name:\\s*['\"]" + name + "['\"],\\s*country:\\s*['\"][^'\"]+['\"],\\s*count:\\s*\\d+,\\s*letter:\\s*['\"][^'\"]+['\"],\\s*image:\\s*)['\"]['\"]", 'g');
    afterBrands = afterBrands.replace(reg, "$1" + imgVar);
  }
  newContent = beforeBrands + afterBrands;
}

fs.writeFileSync('./src/data/products.ts', newContent, 'utf8');
console.log('Updated Marcas in products.ts');
