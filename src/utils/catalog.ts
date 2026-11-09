import type { Product } from '@/types'

// Ayudas compartidas por las vistas internas (WorkList y Notas)
export const fullName = (p: Product) => p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? p.name : `${p.brand} ${p.name}`
export const genderLabel = (g: Product['gender']) => g === 'women' ? 'Dama' : g === 'men' ? 'Caballero' : 'Unisex'
export const genderColor = (g: Product['gender']) => g === 'women' ? '#f472b6' : g === 'men' ? '#60a5fa' : '#a78bfa'
