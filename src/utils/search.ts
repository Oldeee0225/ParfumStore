import { PRODUCTS, BRANDS } from '@/data/products'
import { cleanNoteName } from '@/data/notes'
import type { Product } from '@/types'

// Sin tildes, minúsculas y sin símbolos: "Lancôme" y "lancome" son lo mismo
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const tokens = (q: string) => norm(q).split(' ').filter(Boolean)

const CATEGORY_WORDS: Record<Product['category'], string> = { designer: 'disenador designer', niche: 'nicho niche', arabic: 'arabe arabes arabic' }
const GENDER_WORDS: Record<Product['gender'], string> = { women: 'dama damas mujer mujeres femenino', men: 'caballero caballeros hombre hombres masculino', unisex: 'unisex' }

const notesOf = (p: Product) => [...p.topNotes, ...p.heartNotes, ...p.baseNotes].map(cleanNoteName).filter(Boolean)

const index = PRODUCTS.map(p => ({
  p,
  name: norm(p.name),
  brand: norm(p.brand),
  notes: norm(notesOf(p).join(' ')),
  rest: norm(`${p.family} ${p.type} ${CATEGORY_WORDS[p.category]} ${GENDER_WORDS[p.gender]} ${p.sizes.some(s => s.label.includes('Decant')) ? 'decant decants' : ''}`),
}))

// Cada palabra buscada debe aparecer en algún campo; el nombre pesa más que la marca y las notas
export function searchProducts(q: string): Product[] {
  const words = tokens(q)
  if (words.length === 0) return PRODUCTS
  const full = words.join(' ')
  return index
    .map(e => {
      let score = 0
      for (const w of words) {
        if (e.name.split(' ').some(t => t.startsWith(w))) score += 10
        else if (e.name.includes(w)) score += 7
        else if (e.brand.includes(w)) score += 5
        else if (e.notes.includes(w)) score += 3
        else if (e.rest.includes(w)) score += 2
        else return null
      }
      if (`${e.brand} ${e.name}`.includes(full) || e.name.includes(full)) score += 15
      return { p: e.p, score }
    })
    .filter((x): x is { p: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map(x => x.p)
}

export function searchBrands(q: string): { name: string; count: number }[] {
  const words = tokens(q)
  if (words.length === 0) return []
  return BRANDS
    .filter(b => words.every(w => norm(b.name).includes(w)))
    .map(b => ({ name: b.name, count: PRODUCTS.filter(p => p.brand === b.name).length }))
    .filter(b => b.count > 0)
}

const ALL_NOTES = (() => {
  const seen = new Map<string, { name: string; count: number }>()
  for (const p of PRODUCTS) for (const n of new Set(notesOf(p))) {
    const k = norm(n)
    const cur = seen.get(k)
    if (cur) cur.count++
    else seen.set(k, { name: n, count: 1 })
  }
  return [...seen.values()]
})()

export function searchNotes(q: string): { name: string; count: number }[] {
  const words = tokens(q)
  if (words.length === 0) return []
  return ALL_NOTES
    .filter(n => words.every(w => norm(n.name).includes(w)))
    .sort((a, b) => b.count - a.count)
}

export interface SitePage { title: string; path: string; description: string; keywords: string }

export const SITE_PAGES: SitePage[] = [
  { title: 'Tienda', path: '/tienda', description: 'Todo el catálogo de perfumes', keywords: 'tienda catalogo comprar perfumes todos' },
  { title: 'Perfumes para damas', path: '/tienda?genero=women', description: 'Fragancias femeninas', keywords: 'dama damas mujer mujeres femenino ella' },
  { title: 'Perfumes para caballeros', path: '/tienda?genero=men', description: 'Fragancias masculinas', keywords: 'caballero caballeros hombre hombres masculino el' },
  { title: 'Perfumes unisex', path: '/tienda?genero=unisex', description: 'Para todos', keywords: 'unisex compartir' },
  { title: 'Perfumes de diseñador', path: '/tienda?categoria=designer', description: 'Las grandes casas de moda', keywords: 'disenador designer moda' },
  { title: 'Perfumes nicho', path: '/tienda?categoria=niche', description: 'Perfumería exclusiva', keywords: 'nicho niche exclusivo lujo' },
  { title: 'Perfumes árabes', path: '/tienda?categoria=arabic', description: 'Fragancias de Medio Oriente', keywords: 'arabe arabes arabic oud oriental' },
  { title: 'Decants', path: '/decants', description: 'Prueba en 5 ml y 10 ml antes de comprar la botella', keywords: 'decant decants muestra muestras 5 ml 10 ml probar sets discovery viaje' },
  { title: 'Marcas', path: '/marcas', description: 'Todas las marcas disponibles', keywords: 'marcas marca casas' },
  { title: 'Nosotros', path: '/nosotros', description: 'Quiénes somos y por qué confiar', keywords: 'nosotros quienes somos historia autenticidad original originales contacto whatsapp' },
  { title: 'Envíos y Seguridad', path: '/politicas', description: 'Envíos, pagos y garantía de autenticidad', keywords: 'envio envios entrega delivery pago pagos seguridad politicas garantia contraentrega' },
  { title: 'Notas olfativas', path: '/notas', description: 'Ingredientes de cada fragancia', keywords: 'notas olfativas ingredientes aromas' },
]

export function searchPages(q: string): SitePage[] {
  const words = tokens(q)
  if (words.length === 0) return []
  return SITE_PAGES.filter(pg => {
    const hay = norm(`${pg.title} ${pg.description} ${pg.keywords}`)
    return words.every(w => hay.split(' ').some(t => t.startsWith(w)))
  })
}
