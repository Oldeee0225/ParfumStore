import { useState } from 'react'
import { NOTE_IMAGES } from '../data/notes'

export function NotesPage() {
  const [filter, setFilter] = useState('')

  const notesList = Object.entries(NOTE_IMAGES).map(([id, img]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    img
  })).sort((a, b) => a.name.localeCompare(b.name))

  const filtered = notesList.filter(n => n.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', paddingTop: 108 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--fg)' }}>
        🍃 Notas Olfativas
      </h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--fg3)' }}>
          Total de Notas: <b style={{ color: 'var(--gold)' }}>{notesList.length}</b>
        </span>

        <div style={{ marginLeft: 'auto' }}>
          <input 
            type="text" 
            placeholder="Buscar nota..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--fg)', fontSize: 13, outline: 'none' }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {filtered.map(n => (
          <div
            key={n.id}
            style={{
              position: 'relative',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ede8', padding: 20 }}>
              <img loading="lazy" decoding="async"
                src={n.img}
                alt={n.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div style={{ padding: '12px 10px', textAlign: 'center' }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--fg)',
                textTransform: 'capitalize',
              }}>
                {n.name}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--fg3)' }}>
            No se encontraron notas que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  )
}
