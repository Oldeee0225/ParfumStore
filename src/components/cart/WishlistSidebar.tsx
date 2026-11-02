import { useNavigate } from 'react-router-dom'
import { PRODUCTS } from '@/data/products'
import { useWishlist } from '@/providers/WishlistProvider'

export function WishlistSidebar() {
  const navigate = useNavigate()
  const { wishlist, closeWishlist, toggleWish } = useWishlist()

  const wished = PRODUCTS.filter(p => wishlist.includes(p.id))

  const viewProduct = (id: number) => {
    closeWishlist()
    navigate(`/producto/${id}`)
  }

  return (
    <>
      <div onClick={closeWishlist} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(3px)' }} className="anim-fade-in" />
      <div className="anim-slide-right" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201, width: '100%', maxWidth: 400, background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg)' }}>Mis Favoritos ♥</h3>
          <button onClick={closeWishlist} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--fg3)' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {wished.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>♡</div>
              <p style={{ color: 'var(--fg3)', fontFamily: "'Playfair Display',serif" }}>No tienes favoritos aún</p>
            </div>
          ) : wished.map(p => (
            <div key={p.id} style={{ display: 'flex', gap: 14, marginBottom: 16, padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => viewProduct(p.id)}>
              <img src={p.image} alt={p.name} style={{ width: 64, height: 76, objectFit: 'cover', borderRadius: 6, background: '#f0ede8', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.brand}</p>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', color: 'var(--fg)', fontWeight: 600 }}>{p.name}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--fg)', fontWeight: 700, marginTop: 4 }}>${p.price}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e53935', fontSize: 18, alignSelf: 'flex-start' }}>♥</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
