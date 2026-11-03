import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/components/ui/ProductCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'
import { PRODUCTS } from '@/data/products'

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const brandFromUrl = searchParams.get('marca') || ''
  const catFromUrl = searchParams.get('categoria') || ''
  const genderFromUrl = searchParams.get('genero') || ''

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ brand: brandFromUrl, gender: genderFromUrl, category: catFromUrl, priceMax: 500, family: '' })
  const [sort, setSort] = useState('default')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Sync filters when URL changes
  useEffect(() => {
    const marca = searchParams.get('marca') || ''
    const categoria = searchParams.get('categoria') || ''
    const genero = searchParams.get('genero') || ''
    setFilters(f => ({ ...f, brand: marca, category: categoria, gender: genero }))
  }, [searchParams])

  // Update URL when brand filter changes via the sidebar dropdown
  const updateBrandFilter = (brand: string) => {
    setFilters(f => ({ ...f, brand }))
    if (brand) {
      setSearchParams({ marca: brand }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const clearFilters = () => {
    setFilters({ brand: '', gender: '', category: '', priceMax: 500, family: '' })
    setSearchParams({}, { replace: true })
  }

  const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort()
  const families = [...new Set(PRODUCTS.map(p => p.family))].sort()

  let filtered = PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.brand && p.brand !== filters.brand) return false
    if (filters.gender && p.gender !== filters.gender) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.family && p.family !== filters.family) return false
    if (p.price > filters.priceMax) return false
    return true
  })

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price)
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating)
  else if (sort === 'newest') filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))

  const activeFilterCount = [filters.brand, filters.gender, filters.category, filters.family].filter(Boolean).length + (filters.priceMax < 500 ? 1 : 0)

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <div style={{ background: 'var(--bg2)', padding: '48px clamp(20px,5vw,80px) 36px', textAlign: 'center' }}>
        <SectionLabel text="Nuestra colección" />
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--fg)', fontWeight: 600 }}>Tienda</h1>
        <GoldLine center />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px clamp(20px,5vw,80px)', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start' }} className="r-stack">
        <button onClick={() => setFiltersOpen(o => !o)} className="md:hidden" aria-expanded={filtersOpen}
          style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-card)', color: 'var(--fg)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: -16 }}>
          <span>Filtros{activeFilterCount > 0 && <span style={{ color: 'var(--gold)' }}> ({activeFilterCount})</span>}</span>
          <span style={{ color: 'var(--gold)' }}>{filtersOpen ? '−' : '+'}</span>
        </button>
        <aside className={`shop-filters r-unstick${filtersOpen ? ' open' : ''}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, position: 'sticky', top: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: 'var(--fg)' }}>Filtros</h3>
            <button onClick={clearFilters} style={{ fontSize: '0.72rem', color: 'var(--gold)', border: 'none', background: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>Limpiar todo</button>
          </div>

          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>Tipo</p>
            {[{ v: '', l: 'Todos' }, { v: 'designer', l: 'Diseñador' }, { v: 'niche', l: 'Nicho' }, { v: 'arabic', l: 'Árabe' }].map(opt => (
              <button key={opt.v} onClick={() => setFilters(f => ({ ...f, category: opt.v }))}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 'none', background: 'none', cursor: 'pointer', padding: '5px 0', fontSize: '0.85rem', color: filters.category === opt.v ? 'var(--gold)' : 'var(--fg2)', fontWeight: filters.category === opt.v ? 600 : 400, textAlign: 'left' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${filters.category === opt.v ? 'var(--gold)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {filters.category === opt.v && <span style={{ width: 7, height: 7, background: 'var(--gold)', borderRadius: '50%', display: 'block' }} />}
                </span>
                {opt.l}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>Género</p>
            {[{ v: '', l: 'Todos' }, { v: 'men', l: 'Hombre' }, { v: 'women', l: 'Mujer' }, { v: 'unisex', l: 'Unisex' }].map(opt => (
              <button key={opt.v} onClick={() => setFilters(f => ({ ...f, gender: opt.v }))}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 'none', background: 'none', cursor: 'pointer', padding: '5px 0', fontSize: '0.85rem', color: filters.gender === opt.v ? 'var(--gold)' : 'var(--fg2)', fontWeight: filters.gender === opt.v ? 600 : 400, textAlign: 'left' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${filters.gender === opt.v ? 'var(--gold)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {filters.gender === opt.v && <span style={{ width: 7, height: 7, background: 'var(--gold)', borderRadius: '50%', display: 'block' }} />}
                </span>
                {opt.l}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>Precio máximo</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 700, marginBottom: 10 }}>Hasta ${filters.priceMax}</p>
            <input type="range" min={20} max={500} value={filters.priceMax} onChange={e => setFilters(f => ({ ...f, priceMax: +e.target.value }))}
              style={{ width: '100%', accentColor: 'var(--gold)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--fg3)', marginTop: 4 }}>
              <span>$20</span><span>$500</span>
            </div>
          </div>

          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>Marca</p>
            <select value={filters.brand} onChange={e => updateBrandFilter(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.85rem', outline: 'none' }}>
              <option value="">Todas las marcas</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>Familia Olfativa</p>
            <select value={filters.family} onChange={e => setFilters(f => ({ ...f, family: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.85rem', outline: 'none' }}>
              <option value="">Todas</option>
              {families.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </aside>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', fontSize: 16 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar perfume o marca..."
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.88rem', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--fg3)', whiteSpace: 'nowrap' }}>{filtered.length} resultados</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.82rem', outline: 'none' }}>
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
                <option value="newest">Más recientes</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg2)', marginBottom: 12 }}>Sin resultados</p>
              <p style={{ color: 'var(--fg3)', fontSize: '0.88rem' }}>Intenta cambiar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
