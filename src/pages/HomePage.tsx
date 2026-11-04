import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '@/components/ui/ProductCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'
import { Stars } from '@/components/ui/Stars'
import { PRODUCTS, BRANDS, REVIEWS, GALLERY_IMAGES } from '@/data/products'
import logo from '@/assets/Logo.jpeg'
import heroImg from '@/assets/HeroHome.png'
import decantsImg from '@/assets/Decants.png'

const SHOW_REVIEWS = false

// Cada foto se muestra encima de su propio texto, en la misma columna
const FEATURED_WOMEN = [
  { id: 1, title: 'Miss Dior', tagline: 'La firma floral más icónica de Dior' },
  { id: 12, title: 'Flowerbomb', tagline: 'La bomba floral más deseada' },
]
const FEATURED_MEN = [
  { id: 22, title: 'Sauvage Elixir', tagline: 'El icono salvaje más deseado de Dior' },
  { id: 40, title: 'Acqua di Giò Profondo', tagline: 'El clásico acuático de Armani' },
]

function FeaturedGrid({ items }: { items: { id: number; title: string; tagline: string }[] }) {
  const navigate = useNavigate()
  const featured = items.flatMap(item => {
    const product = PRODUCTS.find(p => p.id === item.id)
    return product ? [{ ...item, product }] : []
  })
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {featured.map(({ product }) => (
        <div key={product.id} style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/producto/${product.id}`)}>
          <img src={product.image} alt={product.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
        </div>
      ))}
      {featured.map(({ product, title, tagline }, i) => (
        <div key={`text-${product.id}`} onClick={() => navigate(`/producto/${product.id}`)}
          style={{ cursor: 'pointer', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(i === 0 ? { background: 'rgba(200,164,93,0.1)', border: '1px solid rgba(200,164,93,0.3)' } : { background: '#1a1a1a' }) }}>
          <p style={{ fontFamily: "'Playfair Display',serif", color: i === 0 ? 'var(--gold)' : '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>{title}</p>
          <p style={{ color: i === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.6 }}>{tagline}</p>
        </div>
      ))}
    </div>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryPaused, setGalleryPaused] = useState(false)

  const bestsellers = PRODUCTS.filter(p => [48, 11, 13, 35].includes(p.id))
  const newLaunches = PRODUCTS.filter(p => [49, 88, 66, 92].includes(p.id))

  const [activeBestsellerId, setActiveBestsellerId] = useState(bestsellers[0]?.id || 48)

  const nextGallery = () => setGalleryIndex(i => (i + 1) % GALLERY_IMAGES.length)
  const prevGallery = () => setGalleryIndex(i => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)

  useEffect(() => {
    if (galleryPaused) return
    const t = setInterval(nextGallery, 3500)
    return () => clearInterval(t)
  }, [galleryPaused])

  const activeBestseller = bestsellers.find(p => p.id === activeBestsellerId) || bestsellers[0]

  return (
    <div>
      <section className="home-hero" style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img src={heroImg} alt="Perfume de lujo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.15) 100%)' }} />
        <div className="anim-fade-up" style={{ position: 'relative', width: '100%', maxWidth: 720, padding: '0 clamp(20px,6vw,96px)', textAlign: 'left' }}>
          <img src={logo} alt="Elegant Parfum Pty" style={{ width: 92, height: 92, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', marginBottom: 24 }} />
          <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20 }}>✦ Perfumería de Lujo ✦</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,6vw,4.2rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.15, marginBottom: 20 }}>
            Descubre la fragancia<br /><em style={{ color: 'var(--gold)' }}>perfecta para ti</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', lineHeight: 1.7, maxWidth: 550, marginBottom: 40 }}>
            Perfumes originales de diseñador, colecciones nicho, fragancias árabes y decants exclusivos. Autenticidad garantizada en cada botella.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/tienda')} className="hero-btn-primary">
              COMPRAR AHORA<span className="arrow">→</span>
            </button>
            <button onClick={() => navigate('/decants')} className="hero-btn-secondary">
              EXPLORAR DECANTS
            </button>
          </div>
          <div className="trust-badges">
            <span className="trust-badge"><span className="tb-icon">✔</span>100% Originales</span>
            <span className="trust-badge"><span className="tb-icon">🚚</span>Envíos Nacionales</span>
            <span className="trust-badge"><span className="tb-icon">⭐</span>+1,200 Clientes Felices</span>
            <span className="trust-badge"><span className="tb-icon">💳</span>Pago Seguro</span>
          </div>
        </div>
        <div className="hero-scroll-hint" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.6 }}>
          <span style={{ fontSize: '0.65rem', color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Explorar</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        </div>
      </section>

      <section style={{ background: 'var(--bg2)', padding: '28px 0', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
          <div className="marquee-track" style={{ display: 'flex', gap: 64, alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--fg3)', textTransform: 'uppercase', transition: 'color 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg3)')}>
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#0e0e0e', padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="Los más populares" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', fontWeight: 600 }}>Perfumes Más Vendidos</h2>
            <GoldLine center />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
            {/* Lista a la Izquierda */}
            <div className="bestseller-list" style={{ flex: '1 1 250px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bestsellers.map(p => {
                const isActive = p.id === activeBestsellerId;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setActiveBestsellerId(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, 
                      padding: '12px 16px', cursor: 'pointer', borderRadius: 8,
                      background: isActive ? 'linear-gradient(90deg, rgba(200,164,93,0.15) 0%, transparent 100%)' : 'transparent',
                      borderLeft: isActive ? '4px solid var(--gold)' : '4px solid transparent',
                      transition: 'all 0.3s'
                    }}
                  >
                    <img src={p.image} alt={p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: isActive ? '1px solid var(--gold)' : '1px solid #333' }} />
                    <div>
                      <p style={{ color: isActive ? 'var(--gold)' : '#fff', fontWeight: isActive ? 700 : 500, fontFamily: "'Playfair Display',serif", fontSize: '1.1rem' }}>{p.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.brand}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Render Central */}
            <div className="bestseller-stage" style={{ flex: '1 1 400px', minWidth: 300, position: 'relative', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
               {/* Resplandor de fondo decorativo */}
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 250, height: 250, background: 'var(--gold)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
               
               <img 
                 key={activeBestsellerId} 
                 src={activeBestseller.image} 
                 alt={activeBestseller.name} 
                 className="anim-fade-up"
                 style={{ maxHeight: '110%', maxWidth: '100%', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))', transform: 'scale(1.05)' }} 
               />
               
               <h3 className="anim-fade-up" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Playfair Display',serif", fontSize: 'clamp(4rem,10vw,8rem)', color: 'rgba(255,255,255,0.03)', whiteSpace: 'nowrap', fontWeight: 900, pointerEvents: 'none', zIndex: 0 }}>
                 {activeBestseller.brand.toUpperCase()}
               </h3>
            </div>

            {/* Información a la Derecha */}
            <div className="anim-fade-up" key={`info-${activeBestsellerId}`} style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{activeBestseller.brand}</p>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,3vw,2.5rem)', color: '#fff', fontWeight: 700, lineHeight: 1.1 }}>{activeBestseller.name}</h3>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                 <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', borderRadius: 4, letterSpacing: '0.1em' }}>{activeBestseller.category === 'designer' ? 'DISEÑADOR' : 'NICHO'}</span>
                 <span style={{ padding: '6px 12px', background: 'rgba(200,164,93,0.15)', color: 'var(--gold)', fontSize: '0.75rem', borderRadius: 4, letterSpacing: '0.1em' }}>{activeBestseller.family}</span>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {activeBestseller.description}
              </p>

              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 6 }}>Notas Principales</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {activeBestseller.topNotes?.map((n: string) => (
                    <span key={n} style={{ fontSize: '0.85rem', color: '#fff' }}>• {n}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 24 }}>
                <p style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 600 }}>${activeBestseller.price}</p>
                <button onClick={() => navigate(`/producto/${activeBestseller.id}`)} className="btn-gold" style={{ padding: '14px 32px', borderRadius: 6, border: 'none', cursor: 'pointer', flex: 1, fontWeight: 600 }}>
                  COMPRAR AHORA
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <button onClick={() => navigate('/tienda')} className="btn-outline" style={{ padding: '12px 32px', borderRadius: 6, cursor: 'pointer', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>VER TODA LA TIENDA</button>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg2)', padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="Recién llegados" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--fg)', fontWeight: 600 }}>Nuevos Lanzamientos</h2>
            <GoldLine center />
          </div>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24 }}>
            {newLaunches.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 540 }}>
        <img src={decantsImg} alt="Decants"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.05) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(20px,5vw,80px)', display: 'flex', alignItems: 'center', minHeight: 540 }}>
          <div style={{ maxWidth: 520 }}>
            <SectionLabel text="Prueba antes de comprar" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
              Colección Exclusiva<br />de <em style={{ color: 'var(--gold)' }}>Decants</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 32, maxWidth: 400 }}>
              Prueba cualquier fragancia de lujo antes de invertir en una botella completa. Decants de 5 ml y 10 ml sellados y auténticos.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              {['5 ml — Desde $7', '10 ml — Desde $12', 'Discovery Sets'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>✦</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/decants')} className="btn-gold" style={{ padding: '13px 32px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
              EXPLORAR DECANTS
            </button>
          </div>
        </div>
      </section>



      <section style={{ background: '#0e0e0e', padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <SectionLabel text="Elegante y femenino" />
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
                Perfumes<br /><em style={{ color: 'var(--gold)' }}>para Damas</em>
              </h2>
              <GoldLine />
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8, marginTop: 20, marginBottom: 32 }}>
                Los iconos femeninos de las casas más prestigiosas. Florales, gourmand y orientales creados para acompañar cada momento de tu día con elegancia.
              </p>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {[['20', 'Fragancias'], ['100%', 'Originales'], ['12h+', 'Duración']].map(([num, label]) => (
                  <div key={label}>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--gold)', fontWeight: 700 }}>{num}</p>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/tienda?genero=women')} className="btn-gold" style={{ padding: '13px 32px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                VER PERFUMES DE MUJER
              </button>
            </div>
            <FeaturedGrid items={FEATURED_WOMEN} />
          </div>
        </div>
      </section>

      <section style={{ background: '#0e0e0e', padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <FeaturedGrid items={FEATURED_MEN} />
            <div>
              <SectionLabel text="Fuerza y elegancia" />
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
                Perfumes<br /><em style={{ color: 'var(--gold)' }}>para Caballeros</em>
              </h2>
              <GoldLine />
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8, marginTop: 20, marginBottom: 32 }}>
                Los favoritos masculinos de las casas de lujo. Aromáticos frescos, amaderados intensos y orientales magnéticos para el hombre moderno.
              </p>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {[['26', 'Fragancias'], ['100%', 'Originales'], ['12h+', 'Duración']].map(([num, label]) => (
                  <div key={label}>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--gold)', fontWeight: 700 }}>{num}</p>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/tienda?genero=men')} className="btn-gold" style={{ padding: '13px 32px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                VER PERFUMES DE HOMBRE
              </button>
            </div>
          </div>
        </div>
      </section>



      {SHOW_REVIEWS && (
        <section style={{ padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px)', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="Lo que dicen nuestros clientes" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--fg)', fontWeight: 600 }}>Opiniones Verificadas</h2>
            <GoldLine center />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {REVIEWS.map((r) => (
              <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                <Stars rating={r.rating} />
                <p style={{ color: 'var(--fg2)', fontSize: '0.87rem', lineHeight: 1.7, margin: '12px 0 16px', fontStyle: 'italic' }}>&quot;{r.comment}&quot;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>
                    {r.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)' }}>{r.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>{r.product}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--fg3)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: '0 0 clamp(48px,8vw,96px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36, padding: '0 24px' }}>
          <SectionLabel text="@elegantparfumpty" />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--fg)', fontWeight: 600 }}>Galería</h2>
          <GoldLine center />
        </div>

        <div
          className="gallery-wrap"
          style={{ position: 'relative', maxWidth: 920, margin: '0 auto', padding: '0 48px' }}
          onMouseEnter={() => setGalleryPaused(true)}
          onMouseLeave={() => setGalleryPaused(false)}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, boxShadow: 'var(--shadow-lg)', aspectRatio: '4/3', background: '#f0ede8' }}>
            <div style={{ display: 'flex', height: '100%', transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${galleryIndex * 100}%)` }}>
              {GALLERY_IMAGES.map((img, i) => (
                <img key={img} src={img} alt={`Galería ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
              ))}
            </div>
          </div>

          <button onClick={prevGallery} aria-label="Anterior"
            style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--fg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: 'var(--shadow-md)', transition: 'all 0.2s', zIndex: 2 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}>
            ‹
          </button>
          <button onClick={nextGallery} aria-label="Siguiente"
            style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--fg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: 'var(--shadow-md)', transition: 'all 0.2s', zIndex: 2 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}>
            ›
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {GALLERY_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setGalleryIndex(i)} aria-label={`Foto ${i + 1}`}
                style={{ width: i === galleryIndex ? 28 : 10, height: 10, borderRadius: 5, border: 'none', cursor: 'pointer', background: i === galleryIndex ? 'var(--gold)' : 'var(--border)', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#111', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
        <SectionLabel text="Newsletter exclusivo" />
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', fontWeight: 600, marginBottom: 12 }}>
          Sé el primero en conocer<br />nuestras <em style={{ color: 'var(--gold)' }}>novedades</em>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', marginBottom: 36, maxWidth: 480, margin: '12px auto 36px' }}>
          Recibe acceso anticipado a nuevos lanzamientos, ofertas exclusivas y guías de fragrancias personalizadas.
        </p>
        {subscribed ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: 'rgba(200,164,93,0.15)', border: '1px solid var(--gold)', borderRadius: 8 }}>
            <span style={{ color: 'var(--gold)' }}>✓</span>
            <span style={{ color: '#fff', fontSize: '0.9rem' }}>¡Gracias por suscribirte! Revisa tu correo.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 480, margin: '0 auto' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
              style={{ flex: 1, minWidth: 240, padding: '13px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: '0.88rem', outline: 'none' }} />
            <button onClick={() => { if (email) setSubscribed(true) }} className="btn-gold" style={{ padding: '13px 28px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
              SUSCRIBIRME
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
