import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'
import { BRANDS } from '@/data/products'

export function BrandsPage() {
  const navigate = useNavigate()
  const [letter, setLetter] = useState('')

  const filtered = BRANDS.filter(b => {
    if (letter && !b.name.toUpperCase().startsWith(letter)) return false
    return true
  })

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <div style={{ background: '#111', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
        <SectionLabel text="Nuestro catálogo" />
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#fff', fontWeight: 600 }}>Nuestras Marcas</h1>
        <GoldLine center />
        <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 16, fontSize: '0.92rem' }}>Más de {BRANDS.length} marcas de prestigio mundial</p>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px clamp(20px,5vw,80px)' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 32, alignItems: 'center' }}>
          <button onClick={() => setLetter('')}
            style={{ padding: '5px 10px', borderRadius: 4, border: `1px solid ${letter === '' ? 'var(--gold)' : 'var(--border)'}`, background: letter === '' ? 'rgba(200,164,93,0.1)' : 'transparent', color: letter === '' ? 'var(--gold)' : 'var(--fg3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
            Todas
          </button>
          {letters.map(l => (
            <button key={l} onClick={() => setLetter(letter === l ? '' : l)}
              style={{ padding: '5px 8px', borderRadius: 4, border: `1px solid ${letter === l ? 'var(--gold)' : 'var(--border)'}`, background: letter === l ? 'rgba(200,164,93,0.1)' : 'transparent', color: letter === l ? 'var(--gold)' : 'var(--fg3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, minWidth: 28 }}>
              {l}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--fg3)' }}>{filtered.length} marcas</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {filtered.map(b => (
            <button key={b.name} onClick={() => navigate(`/tienda?marca=${encodeURIComponent(b.name)}`)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 20px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0 }}>
                <img loading="lazy" decoding="async" src={b.image} alt={b.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: '0.95rem', color: 'var(--fg)', marginBottom: 4 }}>{b.name}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--fg3)', letterSpacing: '0.05em' }}>{b.country}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600, marginTop: 4 }}>{b.count} referencias</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
