import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { WishlistSidebar } from '@/components/cart/WishlistSidebar'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { useTheme } from '@/providers/ThemeProvider'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'

export function Layout() {
  const { darkMode } = useTheme()
  const { isOpen: cartOpen } = useCart()
  const { isOpen: wishlistOpen } = useWishlist()
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const showFooter = pathname !== '/checkout'

  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <ScrollToTop />
      <Navbar />
      <main style={isHome ? { paddingTop: 88 } : undefined}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
      {cartOpen && <CartSidebar />}
      {wishlistOpen && <WishlistSidebar />}
      <WhatsAppButton />
    </div>
  )
}
