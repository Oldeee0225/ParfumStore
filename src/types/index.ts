export type Page = 'home' | 'shop' | 'product' | 'decants' | 'brands' | 'about' | 'contact' | 'checkout'

export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: 'designer' | 'arabic' | 'niche'
  gender: 'men' | 'women' | 'unisex'
  type: string
  family: string
  rating: number
  reviews: number
  isNew?: boolean
  isBestseller?: boolean
  isOnSale?: boolean
  isSoldOut?: boolean
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  longevity: string
  sillage: string
  seasons: string[]
  occasions: string[]
  description: string
  sizes: Array<{ label: string; price: number }>
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  price: number
}
