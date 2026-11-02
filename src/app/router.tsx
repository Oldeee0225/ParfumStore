import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { DecantsPage } from '@/pages/DecantsPage'
import { BrandsPage } from '@/pages/BrandsPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { WorkListPage } from '@/pages/WorkListPage'
import { NotesPage } from '@/pages/NotesPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<ShopPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route path="/decants" element={<DecantsPage />} />
        <Route path="/marcas" element={<BrandsPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/worklist" element={<WorkListPage />} />
        <Route path="/notas" element={<NotesPage />} />
      </Route>
    </Routes>
  )
}
