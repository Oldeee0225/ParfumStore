import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '@/components/ui/ProductCard'
import { Stars } from '@/components/ui/Stars'
import { Badge } from '@/components/ui/Badge'
import { GoldLine } from '@/components/ui/GoldLine'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { PRODUCTS, REVIEWS } from '@/data/products'
import { getNoteImage, cleanNoteName } from '@/data/notes'
import placeholderPerfume from '@/assets/placeholder-perfume.svg'
import type { Product } from '@/types'

const additionalImages = import.meta.glob('../assets/Aditionals/*_001.png', { eager: true, import: 'default' }) as Record<string, string>;
const brandLogos = import.meta.glob('../assets/Marcas/*.{png,jpg,jpeg}', { eager: true, import: 'default' }) as Record<string, string>;

// Quita tildes antes de limpiar: "Olympéa" → "olympea" (coincide con el nombre del archivo)
const stripAccents = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const norm = (s: string) => stripAccents(s).replace(/[^a-z0-9]/g, '');
// Palabras de marca demasiado genéricas para elegir un logo ("Essential Parfums" ≠ "Parfums de Marly")
const GENERIC_BRAND_WORDS = ['parfums', 'parfum', 'perfumes'];
// Logos cuyo nombre de archivo no coincide con la marca
const BRAND_LOGO_FILE: Record<string, string> = { Azzaro: 'azaro.png' };
// Fotos adicionales cuyo nombre de archivo no coincide con el del perfume
// ('' = sin foto adicional todavía; evita que tome la de otro perfume)
const EXTRA_IMAGE_FILE: Record<number, string> = {
  103: '', // Your Devotion: la foto adicional "Devotion" es del frasco rosado, otro perfume
  7: 'Jimmy_Choo_Eau_de_Parfum_001.png',
  37: 'EauDeLacostel.12_001.png',
  39: 'Intenso_D_G__001.png',
  67: '_Parfums_de_Marly_Valaya__001.png',
  69: 'BornToStandOut_Drunk_Lovers__001.png',
  71: '_Lorenzo_Pazzaglia_Gin_Fusion_001.png',
  76: 'Fame_InLove_Rabanne_001.png',
  79: 'Arabian_Sky_001.png',
  80: 'SupremacyCollectors_EditionPour_001.png',
  82: 'Ocean_Noir_001.png',
  84: '9AM_Dive_001.png',
  85: '9_PM_Night_Out_001.png',
  86: 'Ombre_Leather__001.png',
  87: 'Bleu_de_Chanel_EDP_001.png',
  88: 'Coco_Mademoiselle_001.png',
  92: 'Wild_Vetiver_001.png',
  93: 'Megamare_Orto_Parisi_001.png',
  94: 'One_Million_Black_001.png',
  102: 'Mugler_Angel_Nova_Eau_De_Parfum_001.png',
};

function getProductImages(product: Product) {
  const normName = norm(product.name);
  const normBrand = norm(product.brand);
  // "Torino 22" no debe tomar la foto de "Torino 21"
  const nameNumbers = product.name.match(/\d+/g) ?? [];
  const sameNumbers = (file: string) => nameNumbers.every(n => file.includes(n));
  // Sin foto propia todavía: no mostrar fotos adicionales de otro perfume
  const hasOwnPhoto = product.image !== placeholderPerfume;

  const fixedFile = EXTRA_IMAGE_FILE[product.id];
  const isFixed = fixedFile !== undefined;
  let addImg = fixedFile ? additionalImages[`../assets/Aditionals/${fixedFile}`] ?? '' : '';
  // Intentar match directo
  for (const [path, url] of hasOwnPhoto && !isFixed ? Object.entries(additionalImages) : []) {
    const file = norm(path);
    if (file.includes(normName)) {
      addImg = url;
      break;
    }
  }
  // Fallbacks con split de palabras
  if (!addImg && hasOwnPhoto && !isFixed) {
    for (const [path, url] of Object.entries(additionalImages)) {
      const file = norm(path);
      const words = stripAccents(product.name).split(' ').map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 3);
      if (words.length > 0 && words.some(w => file.includes(w)) && file.includes(normBrand.substring(0,4)) && sameNumbers(file)) {
        addImg = url;
        break;
      }
    }
  }
  if (!addImg && hasOwnPhoto && !isFixed) {
    for (const [path, url] of Object.entries(additionalImages)) {
      const file = norm(path);
      const firstWord = norm(product.name.split(' ')[0]);
      if (firstWord.length > 2 && file.includes(firstWord) && sameNumbers(file)) {
        addImg = url;
        break;
      }
    }
  }

  const logoFile = BRAND_LOGO_FILE[product.brand];
  let logoImg = logoFile ? brandLogos[`../assets/Marcas/${logoFile}`] ?? '' : '';
  for (const [path, url] of logoImg ? [] : Object.entries(brandLogos)) {
    const file = norm(path);
    if (file.includes(normBrand) || normBrand.includes(file.replace(/png|jpg|jpeg/g, ''))) {
      logoImg = url;
      break;
    }
    const brandWords = stripAccents(product.brand).split(' ').map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 3 && !GENERIC_BRAND_WORDS.includes(w));
    if (brandWords.length > 0 && brandWords.some(w => file.includes(w))) {
      logoImg = url;
      break;
    }
  }

  return [product.image, addImg || '', logoImg || ''];
}

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { wishlist, toggleWish } = useWishlist()

  const product = PRODUCTS.find(p => p.id === Number(id))
  const defaultSize = product?.sizes[0] ?? { label: '', price: 0 }
  const [selectedSize, setSelectedSize] = useState(defaultSize)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'notes' | 'details' | 'reviews'>('notes')
  const [added, setAdded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (!product) return
    setSelectedSize(product.sizes[0])
    setQty(1)
    setAdded(false)
    setActiveTab('notes')
    setActiveImageIndex(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [product])

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 108, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--fg)', marginBottom: 12 }}>Producto no encontrado</h1>
          <p style={{ color: 'var(--fg3)', fontSize: '0.9rem', marginBottom: 28 }}>La fragancia que buscas no existe o ya no está disponible.</p>
          <button onClick={() => navigate('/tienda')} className="btn-gold" style={{ padding: '13px 32px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>VOLVER A LA TIENDA</button>
        </div>
      </div>
    )
  }

  const isWished = wishlist.includes(product.id)
  const related = PRODUCTS.filter(p => p.id !== product.id && (p.brand === product.brand || p.category === product.category)).slice(0, 4)
  const noteGroups = [
    { title: 'Notas de Salida', notes: product.topNotes, icon: '◎', color: '#C8A45D' },
    { title: 'Notas de Corazón', notes: product.heartNotes, icon: '◉', color: '#A88840' },
    { title: 'Notas de Fondo', notes: product.baseNotes, icon: '●', color: '#7a6030' },
  ].filter(g => g.notes.length > 0)

  const handleAdd = () => {
    addToCart({ product, quantity: qty, size: selectedSize.label, price: selectedSize.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <div style={{ background: 'var(--bg2)', padding: '12px clamp(20px,5vw,80px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.78rem', color: 'var(--fg3)' }}>
          <button onClick={() => navigate('/')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg3)', padding: 0 }}>Inicio</button>
          <span>/</span>
          <button onClick={() => navigate('/tienda')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg3)', padding: 0 }}>Tienda</button>
          <span>/</span>
          <span style={{ color: 'var(--fg)' }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px,5vw,48px) clamp(20px,5vw,80px)' }}>
        <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div className="r-unstick" style={{ position: 'sticky', top: 100 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f0ede8', position: 'relative' }}>
              <img src={getProductImages(product)[activeImageIndex] || product.image} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', transition: 'transform 0.6s ease', padding: activeImageIndex === 2 ? '40px' : '0' }}
                onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')} />
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {product.isSoldOut ? <Badge label="Agotado" type="soldout" /> : product.isNew && <Badge label="Nuevo" type="new" />}
                {product.isOnSale && <Badge label="Oferta" type="sale" />}
                {product.category === 'niche' && <Badge label="Nicho" type="niche" />}
                {product.category === 'arabic' && <Badge label="Árabe" type="arabic" />}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {getProductImages(product).map((imgUrl, i) => (
                <div key={i} onClick={() => imgUrl && setActiveImageIndex(i)} style={{ flex: 1, aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: i === activeImageIndex ? '2px solid var(--gold)' : '1px solid var(--border)', cursor: imgUrl ? 'pointer' : 'default', background: '#f0ede8' }}>
                  {imgUrl && <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: i === activeImageIndex ? 1 : 0.5, padding: i === 2 ? '10px' : '5px' }} />}
                </div>
              ))}
            </div>
          </div>


          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{product.brand}</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'var(--fg)', fontWeight: 600, lineHeight: 1.2, marginBottom: 12 }}>{product.name}</h1>
            {product.reviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Stars rating={product.rating} />
                <span style={{ fontSize: '0.78rem', color: 'var(--fg3)' }}>{product.reviews.toLocaleString()} reseñas</span>
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--fg3)', marginBottom: 20 }}>{product.type} · {product.family}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700, color: 'var(--fg)' }}>${selectedSize.price}</span>
              {product.originalPrice && <span style={{ fontSize: '1.1rem', color: 'var(--fg3)', textDecoration: 'line-through' }}>${product.originalPrice}</span>}
              {product.isOnSale && <span style={{ background: '#e53935', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 3, fontWeight: 700 }}>OFERTA</span>}
            </div>

            <p style={{ color: 'var(--fg2)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: 28 }}>{product.description}</p>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 12 }}>
                Presentación: <span style={{ color: 'var(--gold)' }}>{selectedSize.label}</span>
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s.label} onClick={() => setSelectedSize(s)}
                    style={{ padding: '8px 16px', borderRadius: 6, border: `1.5px solid ${selectedSize.label === s.label ? 'var(--gold)' : 'var(--border)'}`, background: selectedSize.label === s.label ? 'rgba(200,164,93,0.12)' : 'transparent', color: selectedSize.label === s.label ? 'var(--gold)' : 'var(--fg2)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: selectedSize.label === s.label ? 600 : 400, transition: 'all 0.2s' }}>
                    {s.label}<br />
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>${s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>Cantidad</p>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--fg)' }}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontWeight: 600, color: 'var(--fg)' }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--fg)' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <button onClick={handleAdd}
                style={{ flex: 1, padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', background: added ? '#2ecc71' : 'var(--gold)', color: '#111', transition: 'all 0.3s' }}>
                {added ? '✓ AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
              </button>
              <button onClick={() => toggleWish(product.id)}
                style={{ width: 50, height: 50, borderRadius: 8, border: `1.5px solid ${isWished ? '#e53935' : 'var(--border)'}`, background: 'transparent', cursor: 'pointer', fontSize: 20, color: isWished ? '#e53935' : 'var(--fg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {isWished ? '♥' : '♡'}
              </button>
              <button style={{ width: 50, height: 50, borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--fg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⊕</button>
            </div>

            <button onClick={handleAdd} className="btn-dark" style={{ width: '100%', padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 24 }}>
              COMPRAR AHORA
            </button>

            <div style={{ display: 'flex', gap: 8, padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              {[['✓', 'Autenticidad', 'garantizada'], ['■', 'Empaque', 'premium'], ['⚡', 'Envío', 'rápido']].map(([icon, l1, l2]) => (
                <div key={l1} style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: 18, color: 'var(--gold)', marginBottom: 4 }}>{icon}</p>
                  <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--fg)', letterSpacing: '0.05em' }}>{l1}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--fg3)' }}>{l2}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <div className="tabs-scroll" style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 36 }}>
            {(['notes', 'details', 'reviews'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '12px 28px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: activeTab === tab ? 'var(--gold)' : 'var(--fg3)', borderBottom: `2px solid ${activeTab === tab ? 'var(--gold)' : 'transparent'}`, transition: 'all 0.2s', marginBottom: -1 }}>
                {tab === 'notes' ? 'Notas Olfativas' : tab === 'details' ? 'Detalles' : 'Reseñas'}
              </button>
            ))}
          </div>

          {activeTab === 'notes' && noteGroups.length === 0 && (
            <p style={{ color: 'var(--fg3)', fontSize: '0.9rem' }}>Notas olfativas próximamente.</p>
          )}

          {activeTab === 'notes' && noteGroups.length > 0 && (
            <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
              {noteGroups.map(({ title, notes, icon, color }) => (
                <div key={title} style={{ background: 'var(--bg2)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, color, marginBottom: 12 }}>{icon}</div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 16 }}>{title}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                    {notes.map(n => {
                      const img = getNoteImage(n);
                      const cleanName = cleanNoteName(n);
                      return (
                        <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 72 }}>
                          {img ? (
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              <img loading="lazy" decoding="async" src={img} alt={cleanName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                              ✨
                            </div>
                          )}
                          <span style={{ fontSize: '0.75rem', color: 'var(--fg2)', textAlign: 'center', lineHeight: 1.2 }}>{cleanName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 640 }}>
              {[
                ['Duración', product.longevity],
                ['Proyección', product.sillage],
                ['Tipo', product.type],
                ['Familia', product.family],
                ['Estaciones', product.seasons.join(', ')],
                ['Ocasiones', product.occasions.join(', ')],
              ].filter(([, value]) => value).map(([label, value]) => (
                <div key={label} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--fg3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--fg)', fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: 20 }}>
              {REVIEWS.slice(0, 3).map(r => (
                <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                  <Stars rating={r.rating} />
                  <p style={{ color: 'var(--fg2)', fontSize: '0.87rem', lineHeight: 1.7, margin: '10px 0 14px', fontStyle: 'italic' }}>&quot;{r.comment}&quot;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontSize: '0.72rem', fontWeight: 700 }}>{r.avatar}</div>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)' }}>{r.name}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--fg3)' }}>{r.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 8 }}>Perfumes Relacionados</h3>
            <GoldLine />
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20, marginTop: 32 }}>
              {related.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
