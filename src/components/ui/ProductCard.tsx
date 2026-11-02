import { useNavigate } from 'react-router-dom'
import { Stars } from '@/components/ui/Stars'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import type { Product } from '@/types'

export function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { wishlist, toggleWish } = useWishlist()

  const isWished = wishlist.includes(p.id)
  const defaultSize = p.sizes[0]

  const openProduct = () => navigate(`/producto/${p.id}`)

  return (
    <div className="prod-card cursor-pointer group" style={{ background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', transition: 'box-shadow 0.3s, transform 0.3s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', background: '#f0ede8' }} onClick={openProduct}>
        <img src={p.image} alt={p.name} className="prod-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="prod-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
          <button onClick={e => { e.stopPropagation(); addToCart({ product: p, quantity: 1, size: defaultSize.label, price: defaultSize.price }) }}
            className="btn-gold" style={{ width: '100%', padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            AGREGAR AL CARRITO
          </button>
        </div>
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {p.isSoldOut ? <Badge label="Agotado" type="soldout" /> : p.isNew && <Badge label="Nuevo" type="new" />}
          {p.isOnSale && <Badge label="Oferta" type="sale" />}
          {p.isBestseller && <Badge label="Top Venta" type="best" />}
          {p.category === 'niche' && <Badge label="Nicho" type="niche" />}
          {p.category === 'arabic' && <Badge label="Árabe" type="arabic" />}
        </div>
        <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: isWished ? '#e53935' : '#aaa', transition: 'all 0.2s' }}>
          {isWished ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px' }} onClick={openProduct}>
        <p style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{p.brand}</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: '1rem', color: 'var(--fg)', marginBottom: 4 }}>{p.name}</p>
        <p style={{ fontSize: '0.72rem', color: 'var(--fg3)', marginBottom: 8 }}>{p.type} · {p.family}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Stars rating={p.rating} small />
          <span style={{ fontSize: '0.68rem', color: 'var(--fg3)' }}>({p.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--fg)' }}>${p.price}</span>
          {p.originalPrice && <span style={{ fontSize: '0.8rem', color: 'var(--fg3)', textDecoration: 'line-through' }}>${p.originalPrice}</span>}
        </div>
      </div>
    </div>
  )
}
