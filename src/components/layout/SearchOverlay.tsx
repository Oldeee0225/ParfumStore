import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { getNoteImage } from '@/data/notes'
import { useTheme } from '@/providers/ThemeProvider'
import { searchProducts, searchBrands, searchNotes, searchPages } from '@/utils/search'

const MAX_PRODUCTS = 6
const MAX_OTHERS = 4

const QUICK_LINKS = [
  { label: 'Damas', path: '/tienda?genero=women' },
  { label: 'Caballeros', path: '/tienda?genero=men' },
  { label: 'Nicho', path: '/tienda?categoria=niche' },
  { label: 'Árabes', path: '/tienda?categoria=arabic' },
  { label: 'Decants', path: '/decants' },
  { label: 'Envíos', path: '/politicas' },
]

interface Item { key: string; path: string }

const sectionTitle = { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)', padding: '14px 20px 6px' } as const

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const query = q.trim()
  const results = useMemo(() => {
    if (!query) return null
    const products = searchProducts(query)
    return {
      total: products.length,
      products: products.slice(0, MAX_PRODUCTS),
      brands: searchBrands(query).slice(0, MAX_OTHERS),
      notes: searchNotes(query).slice(0, MAX_OTHERS),
      pages: searchPages(query).slice(0, MAX_OTHERS),
    }
  }, [query])

  const shopPath = `/tienda?q=${encodeURIComponent(query)}`

  // Orden de navegación con flechas: el mismo en que se muestran
  const items: Item[] = results ? [
    ...results.products.map(p => ({ key: `p${p.id}`, path: `/producto/${p.id}` })),
    ...results.brands.map(b => ({ key: `b${b.name}`, path: `/tienda?marca=${encodeURIComponent(b.name)}` })),
    ...results.notes.map(n => ({ key: `n${n.name}`, path: `/tienda?q=${encodeURIComponent(n.name)}` })),
    ...results.pages.map(pg => ({ key: `g${pg.path}`, path: pg.path })),
    ...(results.total > 0 ? [{ key: 'all', path: shopPath }] : []),
  ] : []
  const indexOf = (key: string) => items.findIndex(i => i.key === key)

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (path: string) => { onClose(); navigate(path) }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); setActive(a => (a + 1) % items.length) }
    else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); setActive(a => (a - 1 + items.length) % items.length) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (items[active]) go(items[active].path)
      else if (query) go(shopPath)
    }
  }

  const rowStyle = (key: string) => {
    const on = indexOf(key) === active
    return {
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '8px 20px', border: 'none', cursor: 'pointer', textAlign: 'left' as const,
      background: on ? 'var(--bg2)' : 'transparent', color: 'var(--fg)', borderLeft: `3px solid ${on ? 'var(--gold)' : 'transparent'}`,
    }
  }
  const row = (key: string) => ({
    'data-active': indexOf(key) === active,
    onMouseEnter: () => setActive(indexOf(key)),
    style: rowStyle(key),
  })

  const empty = results && items.length === 0

  // Portal al <body>: el navbar usa backdrop-filter, que atraparía un panel "fixed" dentro de él.
  // La clase del tema se repite aquí porque el <body> queda fuera del contenedor .dark-mode
  return createPortal(
    <div onClick={onClose} className={`anim-fade-in${darkMode ? ' dark-mode' : ''}`} role="presentation"
      style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 'clamp(0px, 8vh, 96px) 0 0' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Buscar en la tienda"
        style={{ width: '100%', maxWidth: 640, maxHeight: 'min(80vh, 720px)', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', margin: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="var(--gold)" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Busca perfumes, marcas, notas o páginas…"
            aria-label="Buscar"
            role="combobox"
            aria-expanded={!!results}
            aria-controls="search-results"
            autoComplete="off"
            enterKeyHint="search"
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', color: 'var(--fg)', fontSize: 16, outline: 'none' }}
          />
          {q && <button onClick={() => setQ('')} aria-label="Borrar búsqueda" style={{ border: 'none', background: 'none', color: 'var(--fg3)', cursor: 'pointer', fontSize: 14, padding: 4 }}>Borrar</button>}
          <button onClick={onClose} aria-label="Cerrar buscador" style={{ border: '1px solid var(--border)', background: 'none', color: 'var(--fg3)', cursor: 'pointer', fontSize: 11, padding: '3px 7px', borderRadius: 5 }}>Esc</button>
        </div>

        <div ref={listRef} id="search-results" role="listbox" style={{ overflowY: 'auto', paddingBottom: 8 }}>
          {!results && (
            <div style={{ padding: '16px 20px' }}>
              <p style={{ ...sectionTitle, padding: '0 0 10px' }}>Accesos rápidos</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {QUICK_LINKS.map(l => (
                  <button key={l.path} onClick={() => go(l.path)}
                    style={{ padding: '7px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--fg)', cursor: 'pointer', fontSize: '0.82rem' }}>
                    {l.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginTop: 16 }}>Prueba con un perfume (“Sauvage”), una marca (“Rasasi”) o una nota (“vainilla”).</p>
            </div>
          )}

          {empty && (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--fg3)', fontSize: '0.9rem' }}>
              No encontramos resultados para “{query}”.
              <div style={{ marginTop: 10, fontSize: '0.8rem' }}>Revisa la ortografía o escríbenos por WhatsApp y te lo conseguimos.</div>
            </div>
          )}

          {results && results.products.length > 0 && (
            <>
              <p style={sectionTitle}>Perfumes</p>
              {results.products.map(p => (
                <button key={p.id} role="option" aria-selected={indexOf(`p${p.id}`) === active} onClick={() => go(`/producto/${p.id}`)} {...row(`p${p.id}`)}>
                  <img src={p.image} alt="" decoding="async" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: 'var(--bg2)' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{p.brand}</span>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>${p.price}</span>
                </button>
              ))}
            </>
          )}

          {results && results.brands.length > 0 && (
            <>
              <p style={sectionTitle}>Marcas</p>
              {results.brands.map(b => (
                <button key={b.name} role="option" aria-selected={indexOf(`b${b.name}`) === active} onClick={() => go(`/tienda?marca=${encodeURIComponent(b.name)}`)} {...row(`b${b.name}`)}>
                  <span style={{ flex: 1, fontSize: '0.9rem' }}>{b.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>{b.count} perfume{b.count === 1 ? '' : 's'}</span>
                </button>
              ))}
            </>
          )}

          {results && results.notes.length > 0 && (
            <>
              <p style={sectionTitle}>Notas olfativas</p>
              {results.notes.map(n => {
                const img = getNoteImage(n.name)
                return (
                  <button key={n.name} role="option" aria-selected={indexOf(`n${n.name}`) === active} onClick={() => go(`/tienda?q=${encodeURIComponent(n.name)}`)} {...row(`n${n.name}`)}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--bg2)' }}>
                      {img && <img src={img} alt="" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </span>
                    <span style={{ flex: 1, fontSize: '0.9rem' }}>{n.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>en {n.count} perfume{n.count === 1 ? '' : 's'}</span>
                  </button>
                )
              })}
            </>
          )}

          {results && results.pages.length > 0 && (
            <>
              <p style={sectionTitle}>Páginas</p>
              {results.pages.map(pg => (
                <button key={pg.path} role="option" aria-selected={indexOf(`g${pg.path}`) === active} onClick={() => go(pg.path)} {...row(`g${pg.path}`)}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.9rem' }}>{pg.title}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--fg3)' }}>{pg.description}</span>
                  </span>
                  <span aria-hidden style={{ color: 'var(--fg3)' }}>→</span>
                </button>
              ))}
            </>
          )}

          {results && results.total > 0 && (
            <button role="option" aria-selected={indexOf('all') === active} onClick={() => go(shopPath)} {...row('all')}>
              <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>
                Ver {results.total === 1 ? 'el resultado' : `los ${results.total} perfumes`} en la tienda →
              </span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
