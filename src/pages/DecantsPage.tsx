import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'
import { PRODUCTS } from '@/data/products'
import torino21Img from '@/assets/Aditionals/Torino21_001.png'

import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { useNavigate } from 'react-router-dom'
import { Stars } from '@/components/ui/Stars'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types'

function DecantCard({ p }: { p: Product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { wishlist, toggleWish } = useWishlist()

  const isWished = wishlist.includes(p.id)
  
  const decant5 = p.sizes.find(s => s.label.includes('5 ml'))
  const decant10 = p.sizes.find(s => s.label.includes('10 ml'))

  const openProduct = () => navigate(`/producto/${p.id}`)

  return (
    <div className="prod-card cursor-pointer group" style={{ background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', transition: 'box-shadow 0.3s, transform 0.3s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', background: '#f0ede8' }} onClick={openProduct}>
        <img loading="lazy" decoding="async" src={p.image} alt={p.name} className="prod-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="prod-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            {decant5 && (
              <button onClick={e => { e.stopPropagation(); addToCart({ product: p, quantity: 1, size: decant5.label, price: decant5.price }) }}
                className="btn-gold" style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                5ml (${decant5.price})
              </button>
            )}
            {decant10 && (
              <button onClick={e => { e.stopPropagation(); addToCart({ product: p, quantity: 1, size: decant10.label, price: decant10.price }) }}
                className="btn-gold" style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                10ml (${decant10.price})
              </button>
            )}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {p.isSoldOut ? <Badge label="Agotado" type="soldout" /> : p.isNew && <Badge label="Nuevo" type="new" />}
          {p.isOnSale && <Badge label="Oferta" type="sale" />}
        </div>
        <button onClick={e => { e.stopPropagation(); toggleWish(p.id) }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: isWished ? '#e53935' : '#aaa', transition: 'all 0.2s' }}>
          {isWished ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px' }} onClick={openProduct}>
        <p style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{p.brand}</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: '1rem', color: 'var(--fg)', marginBottom: 4 }}>{p.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Stars rating={p.rating} small />
          <span style={{ fontSize: '0.68rem', color: 'var(--fg3)' }}>({p.reviews.toLocaleString()})</span>
        </div>
      </div>
    </div>
  )
}

export function DecantsPage() {
  const decantProducts = PRODUCTS.filter(p => p.sizes.some(s => s.label.includes('Decant')))

  const discoverySets = [
    { name: 'Set Damas Esencial', items: ['Miss Dior EDP', 'Carolina Herrera La Bomba', 'YSL Libre', 'Versace Crystal Noir'], price: 35, originalPrice: 45, size: '5 ml c/u' },
    { name: 'Set Damas Premium', items: ['Lancôme La Vie Est Belle Elixir', 'Burberry Her Elixir', 'JPG Divine Couture', 'Lancôme La Nuit Trésor'], price: 45, originalPrice: 60, size: '5 ml c/u' },
    { name: 'Set Caballeros Esencial', items: ['Dior Sauvage EDP', 'Valentino Born in Roma Intense', 'Azzaro The Most Wanted', 'Hawas Ice'], price: 38, originalPrice: 50, size: '5 ml c/u' },
    { name: 'Set Caballeros Premium', items: ['Dior Sauvage Elixir', 'Le Male Elixir', 'Spicebomb Extreme', 'YSL Le Parfum'], price: 65, originalPrice: 85, size: '10 ml c/u' },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <section style={{ position: 'relative', padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,80px)', background: '#0e0e0e', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(200,164,93,0.08) 0%, transparent 60%)' }} />
        <div className="r-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <SectionLabel text="Prueba antes de comprar" />
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
              Descubre Antes<br />de <em style={{ color: 'var(--gold)' }}>Comprar</em>
            </h1>
            <GoldLine />
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.8, marginTop: 20, marginBottom: 36 }}>
              Los decants son pequeñas muestras auténticas de perfumes de lujo. Perfectos para explorar nuevas fragancias sin comprometerte a una botella completa. Sellados, auténticos y enviados con cuidado.
            </p>
            <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
              {[['5 ml', 'Desde $7', 'Ideal para probar'], ['10 ml', 'Desde $12', 'Para una semana'], ['Sets', 'Desde $38', '4-6 fragancias']].map(([size, price, desc]) => (
                <div key={size} style={{ textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: 'var(--gold)', fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 700 }}>{size}</div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>{price}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img src={torino21Img} alt="Decants de perfume" style={{ width: '100%', borderRadius: 16, objectFit: 'cover', maxHeight: 450 }} />
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg2)', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', marginBottom: 48 }}>
          <SectionLabel text="¿Por qué elegir decants?" />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg)', fontWeight: 600 }}>La Forma Inteligente de Explorar</h2>
          <GoldLine center />
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {[
            { icon: '💰', title: 'Ahorra Dinero', desc: 'Prueba sin invertir $200+ en una botella que quizás no te convenza.' },
            { icon: '✦', title: '100% Auténticos', desc: 'Directamente de botellas originales. Nunca imitaciones ni reproductions.' },
            { icon: '🌍', title: 'Explora el Mundo', desc: 'Accede a fragancias de nicho raramente disponibles en tu país.' },
            { icon: '🧳', title: 'Perfectos de Viaje', desc: 'Compactos y seguros para llevar en avión. Cumple con las normativas.' },
            { icon: '🎁', title: 'Regalo Ideal', desc: 'Regala la experiencia de múltiples lujos en un elegante paquete.' },
            { icon: '📦', title: 'Empaque Premium', desc: 'Cada decant se entrega en caja sellada con todos los detalles de la fragancia.' },
          ].map(item => (
            <div key={item.title} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid var(--border)', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 8 }}>{item.title}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--fg2)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="Curados por expertos" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg)', fontWeight: 600 }}>Discovery Sets</h2>
            <GoldLine center />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: 24 }}>
            {discoverySets.map((set, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
                <div style={{ background: 'linear-gradient(135deg, #1a1410 0%, #0e0e0e 100%)', padding: '28px 24px 20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)', color: '#111', padding: '4px 10px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', zIndex: 2 }}>
                    PROMO
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(200,164,93,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: "'Playfair Display',serif", fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.3 }}>
                    {set.size}
                  </div>
                  <p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Set Discovery</p>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.3 }}>{set.name}</h3>
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <div style={{ marginBottom: 16 }}>
                    {set.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>✦</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--fg2)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--fg3)', textDecoration: 'line-through' }}>${set.originalPrice}</span>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)' }}>${set.price}</span>
                    </div>
                    <button className="btn-gold" style={{ padding: '9px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>AGREGAR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg2)', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="Decants individuales" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg)', fontWeight: 600 }}>Elige tu Fragancia</h2>
            <GoldLine center />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {decantProducts.map(p => (
              <DecantCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
