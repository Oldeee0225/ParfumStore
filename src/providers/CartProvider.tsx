import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { CartItem } from '@/types'

interface CartContextValue {
  items: CartItem[]
  cartCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  updateQty: (index: number, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product.id === item.product.id && i.size === item.size)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity }
        return updated
      }
      return [...prev, item]
    })
    setIsOpen(true)
  }

  const removeFromCart = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const updateQty = (i: number, qty: number) => setItems(prev => prev.map((item, idx) => (idx === i ? { ...item, quantity: qty } : item)))

  const clearCart = () => setItems([])

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen(o => !o),
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
