import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/providers/CartProvider'

export function CartSidebar() {
  const navigate = useNavigate()
  const { items, closeCart, removeFromCart, updateQty } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal - discount

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'ELEGANT10') setDiscount(subtotal * 0.1)
    else if (coupon.toUpperCase() === 'DECANT20') setDiscount(subtotal * 0.2)
  }

  const goCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      <div onClick={closeCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(3px)' }} className="anim-fade-in" />
      <div className="anim-slide-right" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201, width: '100%', maxWidth: 420, background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg)' }}>Mi Carrito</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginTop: 2 }}>{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</p>
          </div>
          <button onClick={closeCart} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--fg3)', padding: 4 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⊞</div>
              <p style={{ color: 'var(--fg3)', fontFamily: "'Playfair Display',serif", fontSize: '1.1rem' }}>Tu carrito está vacío</p>
              <p style={{ color: 'var(--fg3)', fontSize: '0.82rem', marginTop: 8 }}>Descubre nuestra colección</p>
            </div>
          ) : items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <img src={item.product.image} alt={item.product.name} style={{ width: 72, height: 86, objectFit: 'cover', borderRadius: 8, background: '#f0ede8', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.product.brand}</p>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.92rem', color: 'var(--fg)', marginBottom: 2, fontWeight: 600 }}>{item.product.name}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--fg3)', marginBottom: 8 }}>{item.size}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                    <button className="qty-btn" onClick={() => updateQty(i, Math.max(1, item.quantity - 1))} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--fg)' }}>−</button>
                    <span style={{ width: 28, textAlign: 'center', fontSize: '0.82rem', color: 'var(--fg)' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(i, item.quantity + 1)} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--fg)' }}>+</button>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--fg)', fontSize: '0.92rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg3)', fontSize: 14, marginLeft: 'auto' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '16px 24px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Código de descuento"
                style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.8rem', outline: 'none' }} />
              <button onClick={applyCoupon} className="btn-outline" style={{ padding: '9px 14px', borderRadius: 6, cursor: 'pointer' }}>Aplicar</button>
            </div>

            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--fg2)' }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#2ecc71' }}>
                  <span>Descuento</span><span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--fg2)' }}>
                <span>Envío</span><span>Por acordar</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--fg)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={goCheckout} className="btn-gold" style={{ width: '100%', padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
              FINALIZAR COMPRA
            </button>
          </div>
        )}
      </div>
    </>
  )
}
