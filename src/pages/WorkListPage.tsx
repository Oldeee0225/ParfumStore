import { useState, useEffect } from 'react'
import { PRODUCTS } from '../data/products'

const STORAGE_KEY = 'worklist-discarded'

function getDiscarded(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function WorkListPage() {
  const [discarded, setDiscarded] = useState<number[]>(getDiscarded)
  const [filter, setFilter] = useState<'all' | 'pending' | 'discarded'>('all')
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women'>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(discarded))
  }, [discarded])

  const toggle = (id: number) => {
    setDiscarded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const filtered = PRODUCTS.filter(p => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false
    if (filter === 'pending') return !discarded.includes(p.id)
    if (filter === 'discarded') return discarded.includes(p.id)
    return true
  })

  const pending = PRODUCTS.filter(p => !discarded.includes(p.id)).length
  const done = discarded.length

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        📋 Lista de Trabajo
      </h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: '#888' }}>
          Pendientes: <b style={{ color: '#f59e0b' }}>{pending}</b> | Descartados: <b style={{ color: '#10b981' }}>{done}</b> | Total: <b>{PRODUCTS.length}</b>
        </span>

        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          {(['all', 'pending', 'discarded'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                background: filter === f ? '#7c3aed' : '#27272a',
                color: filter === f ? '#fff' : '#a1a1aa',
              }}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : 'Descartados'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'women', 'men'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                background: genderFilter === g ? '#2563eb' : '#27272a',
                color: genderFilter === g ? '#fff' : '#a1a1aa',
              }}
            >
              {g === 'all' ? 'Todos' : g === 'women' ? '♀ Damas' : '♂ Caballeros'}
            </button>
          ))}
        </div>

        <button
          onClick={() => { if (confirm('¿Limpiar todo?')) setDiscarded([]) }}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #ef4444',
            background: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Reset
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {filtered.map(p => {
          const isDiscarded = discarded.includes(p.id)
          return (
            <div
              key={p.id}
              onClick={() => toggle(p.id)}
              style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                border: isDiscarded ? '2px solid #10b981' : '2px solid #27272a',
                opacity: isDiscarded ? 0.4 : 1,
                transition: 'all 0.2s',
                background: '#18181b',
              }}
            >
              {isDiscarded && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 2,
                  fontSize: 36,
                }}>
                  ✅
                </div>
              )}

              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: '100%',
                  height: 180,
                  objectFit: 'contain',
                  background: '#0f0f0f',
                  padding: 8,
                }}
              />

              <div style={{ padding: '8px 10px' }}>
                <div style={{
                  fontSize: 11,
                  color: p.gender === 'women' ? '#f472b6' : '#60a5fa',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {p.brand}
                </div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#e4e4e7',
                  lineHeight: 1.3,
                  marginTop: 2,
                }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>
                  ID: {p.id} · {p.gender === 'women' ? 'Dama' : 'Caballero'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
