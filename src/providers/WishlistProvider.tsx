import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface WishlistContextValue {
  wishlist: number[]
  isOpen: boolean
  openWishlist: () => void
  closeWishlist: () => void
  toggleWishlist: () => void
  toggleWish: (id: number) => void
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleWish = (id: number) => setWishlist(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isOpen,
        openWishlist: () => setIsOpen(true),
        closeWishlist: () => setIsOpen(false),
        toggleWishlist: () => setIsOpen(o => !o),
        toggleWish,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist debe usarse dentro de WishlistProvider')
  return ctx
}
