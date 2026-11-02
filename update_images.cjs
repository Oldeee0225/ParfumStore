const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');

const imports = `
// ─── Nuevas Imágenes ────────────────────────────────────────────────
import carolinaGoodGirlJasmine from '../assets/Damas/Carolina_Herrera_GoodGirl_JasmineAbsolute.png'
import rabanneFameInLove from '../assets/Damas/Rabanne_FameInLove.png'
import cocoMademoiselle from '../assets/Damas/Coco_Mademoiselle_Chanel.png'
import valentinoDonnaPurpleMelancholia from '../assets/Damas/Valentino_DonnaPurpleMelancholia.png'
import valentinoBornInRomaExtradoseDonna from '../assets/Damas/BorninRoma_Extradose_Donna_Valentino.png'

import hawasKobra from '../assets/Caballeros/Hawas_Kobra.png'
import hawasPink from '../assets/Caballeros/Hawas_Pink.png'
import afnanArabianSky from '../assets/Caballeros/Afnan_ArabianSky.png'
import afnanSupremacyCollector from '../assets/Caballeros/Afnan_SupremacyCollectorsEdition.png'
import pacoInvictusParfum from '../assets/Caballeros/Paco_Rabanne_Invictus_Parfum.png'
import michaelMalulOceanNoir from '../assets/Caballeros/MichaelMalul_OceanNoir.png'
import armafCDNIPrecieux from '../assets/Caballeros/Armaf_ClubDeNuit_PrecieuxI.png'
import afnan9AMDive from '../assets/Caballeros/Afnan_9AmDive.png'
import afnan9PMNightOut from '../assets/Caballeros/Afnan_9pmNightOut.png'
import tomFordOmbreLeather from '../assets/Caballeros/TomFord_OmbreLeather.png'
import chanelBleuEDP from '../assets/Caballeros/Chanel_Bleu_EauDeParfum.png'
import armaniAcquaDiGioParfum from '../assets/Caballeros/AcquadiGiòParfumGiorgioArmani.png'
import creedWildVetiver from '../assets/Caballeros/Creed_WildVetiver.png'
import ortoParisiMegamare from '../assets/Caballeros/OrtoParasi_Megamare.png'
`;

let newContent = content.replace('export const PRODUCTS: Product[] = [', imports + '\nexport const PRODUCTS: Product[] = [');

const replacements = [
  ['Good Girl Jasmine Absolute', 'carolinaGoodGirlJasmine'],
  ['Fame in Love', 'rabanneFameInLove'],
  ['Hawas Kobra', 'hawasKobra'],
  ['Hawas Pink', 'hawasPink'],
  ['Arabian Sky', 'afnanArabianSky'],
  ['Supremacy Collector', 'afnanSupremacyCollector'],
  ['Invictus Parfum', 'pacoInvictusParfum'],
  ['Ocean Noir', 'michaelMalulOceanNoir'],
  ['Club de Nuit Precieux I', 'armafCDNIPrecieux'],
  ['9AM Dive', 'afnan9AMDive'],
  ['9 PM Night Out', 'afnan9PMNightOut'],
  ['Ombré Leather', 'tomFordOmbreLeather'],
  ['Bleu de Chanel', 'chanelBleuEDP'],
  ['Coco Mademoiselle', 'cocoMademoiselle'],
  ['Donna Purple Melancholia', 'valentinoDonnaPurpleMelancholia'],
  ['Born in Roma Extradose Donna', 'valentinoBornInRomaExtradoseDonna'],
  ['Acqua di Giò Parfum', 'armaniAcquaDiGioParfum'],
  ['Wild Vetiver', 'creedWildVetiver'],
  ['Megamare', 'ortoParisiMegamare']
];

for (const [nameMatch, imgVar] of replacements) {
  const reg = new RegExp("(name:\\s*['\"](?:.*?)?" + nameMatch + "(?:.*?)?['\"].*?)image:\\s*['\"]['\"]", 's');
  newContent = newContent.replace(reg, "$1image: " + imgVar + ",");
}

fs.writeFileSync('./src/data/products.ts', newContent, 'utf8');
console.log('Updated products.ts');
