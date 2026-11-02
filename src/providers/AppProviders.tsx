import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { WishlistProvider } from '@/providers/WishlistProvider'
import { CartProvider } from '@/providers/CartProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
