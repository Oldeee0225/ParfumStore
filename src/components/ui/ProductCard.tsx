import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { cleanNoteName } from '@/data/notes'
import type { Product } from '@/types'

const GENDER_LABEL: Record<Product['gender'], string> = { men: 'Hombre', women: 'Mujer', unisex: 'Unisex' }
const CATEGORY_LABEL: Record<Product['category'], string> = { designer: 'Diseñador', niche: 'Nicho', arabic: 'Árabe' }

const money = (v: number) => `$${Number.isInteger(v) ? v : v.toFixed(2)}`
// "10 ml Decant" → "10 ml", "100 ml (Pedido solo contraentrega)" → "100 ml"
const sizeLabel = (label: string) => label.match(/^\d+\s?ml/i)?.[0] ?? label

export function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { wishlist, toggleWish } = useWishlist()
  const [sizeIndex, setSizeIndex] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const t = window.setTimeout(() => setAdded(false), 1400)
    return () => window.clearTimeout(t)
  }, [added])

  const isWished = wishlist.includes(p.id)
  const size = p.sizes[sizeIndex] ?? p.sizes[0]
  const notes = p.topNotes.map(cleanNoteName).filter(Boolean).slice(0, 3)

  const openProduct = () => navigate(`/producto/${p.id}`)
  const add = () => {
    addToCart({ product: p, quantity: 1, size: size.label, price: size.price })
    setAdded(true)
  }

  return (
    <div className="prod-card" style={{ background: 'var(--bg-card)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', transition: 'box-shadow 0.3s, transform 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
      <div className="prod-media" onClick={openProduct}
        style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', margin: 12, marginBottom: 0, borderRadius: 10, background: '#f0ede8', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
        <img src={p.image} alt={p.name} className="prod-img" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: p.isSoldOut ? 0.6 : 1 }} />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <span style={{ background: '#fff', color: '#17120e', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, padding: '4px 10px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            {GENDER_LABEL[p.gender]}
          </span>
          {p.isSoldOut ? <Badge label="Agotado" type="soldout" /> : p.isNew && <Badge label="Nuevo" type="new" />}
          {p.isOnSale && <Badge label="Oferta" type="sale" />}
          {p.isBestseller && <Badge label="Top Venta" type="best" />}
        </div>
        <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }} aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: isWished ? '#e53935' : '#aaa', transition: 'all 0.2s' }}>
          {isWished ? '♥' : '♡'}
        </button>
      </div>

      <div className="prod-info" style={{ padding: '16px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div onClick={openProduct} style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.66rem', color: 'var(--fg3)', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
            {p.brand} · {CATEGORY_LABEL[p.category]}
          </p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: '1.08rem', color: 'var(--fg)', lineHeight: 1.25, marginBottom: 6 }}>{p.name}</p>
          {notes.length > 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginBottom: 14 }}>{notes.join(' · ')}</p>
          )}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {p.sizes.map((s, i) => {
              const active = i === sizeIndex
              return (
                <button key={s.label} className="size-chip" onClick={() => setSizeIndex(i)} aria-pressed={active} title={s.label}
                  style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.2s', border: `1px solid ${active ? 'var(--fg)' : 'var(--border)'}`, background: active ? 'var(--fg)' : 'transparent', color: active ? 'var(--bg-card)' : 'var(--fg2)' }}>
                  {sizeLabel(s.label)} — {money(s.price)}
                </button>
              )
            })}
          </div>

          <button className="add-btn" onClick={add} disabled={p.isSoldOut}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 10px', borderRadius: 8, cursor: p.isSoldOut ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', transition: 'all 0.2s', border: `1px solid ${added ? 'var(--gold)' : 'var(--border)'}`, background: added ? 'var(--gold)' : 'transparent', color: added ? '#111' : 'var(--fg)', opacity: p.isSoldOut ? 0.5 : 1 }}
            onMouseEnter={e => { if (!p.isSoldOut && !added) e.currentTarget.style.borderColor = 'var(--gold)' }}
            onMouseLeave={e => { if (!added) e.currentTarget.style.borderColor = 'var(--border)' }}>
            {p.isSoldOut ? 'AGOTADO' : added ? '✓ AGREGADO' : (
              <>
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                AGREGAR — {money(size.price)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
