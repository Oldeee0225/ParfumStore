import { useState, useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'
import { PRODUCTS } from '../data/products'
import type { Product } from '@/types'

const STORAGE_KEY = 'worklist-v2'
const LONG_PRESS_MS = 500
const MAX_STATUSES = 2

type Status = 'delete' | 'photos' | 'decants'
type PriceKey = 'bottle' | 'd10' | 'd5'
type Prices = Partial<Record<PriceKey, number>>

interface WorkState {
  status: Record<number, Status[]>
  prices: Record<number, Prices>
}

const STATUS_STYLE: Record<Status | 'pending', { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: '#27272a', bg: '#18181b' },
  delete: { label: '🗑 Eliminar', color: '#ef4444', bg: '#2a1215' },
  photos: { label: '📷 Cambiar fotos', color: '#10b981', bg: '#0f2a20' },
  decants: { label: '🧪 Cambiar decants', color: '#a855f7', bg: '#24123a' },
}

const STATUSES: Status[] = ['delete', 'photos', 'decants']
const EXPORT_TITLE: Record<Status, string> = { delete: 'ELIMINAR', photos: 'CAMBIAR FOTOS', decants: 'CAMBIAR DECANTS' }

const PRICE_LABELS: Record<PriceKey, string> = { bottle: 'Botella', d10: '10 ml', d5: '5 ml' }

function loadState(): WorkState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const byId = new Map(PRODUCTS.map(p => [p.id, p]))
    // Versiones anteriores guardaban un solo estado por perfume ('delete'); ahora es una lista
    const status: Record<number, Status[]> = {}
    for (const [id, v] of Object.entries(parsed?.status ?? {})) {
      if (!byId.has(Number(id))) continue
      const list = (Array.isArray(v) ? v : [v]).filter((x): x is Status => STATUSES.includes(x as Status))
      if (list.length > 0) status[Number(id)] = [...new Set(list)].slice(0, MAX_STATUSES)
    }
    // Precios que ya se aplicaron al catálogo dejan de contar como "editados"
    const prices: Record<number, Prices> = {}
    for (const [id, pr] of Object.entries((parsed?.prices ?? {}) as Record<string, Prices>)) {
      const p = byId.get(Number(id))
      if (!p) continue
      const orig = originalPrices(p)
      const pending = Object.fromEntries(Object.entries(pr).filter(([k, v]) => v !== orig[k as PriceKey])) as Prices
      if (Object.keys(pending).length > 0) prices[Number(id)] = pending
    }
    return { status, prices }
  } catch {
    return { status: {}, prices: {} }
  }
}

function originalPrices(p: Product): Prices {
  const bottle = p.sizes.find(s => !s.label.includes('Decant'))
  return {
    bottle: bottle?.price,
    d10: p.sizes.find(s => s.label === '10 ml Decant')?.price,
    d5: p.sizes.find(s => s.label === '5 ml Decant')?.price,
  }
}

const fullName = (p: Product) => p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? p.name : `${p.brand} ${p.name}`
const money = (v?: number) => v === undefined ? '—' : `$${Number.isInteger(v) ? v : v.toFixed(2)}`
const genderLabel = (g: Product['gender']) => g === 'women' ? 'Dama' : g === 'men' ? 'Caballero' : 'Unisex'
const genderColor = (g: Product['gender']) => g === 'women' ? '#f472b6' : g === 'men' ? '#60a5fa' : '#a78bfa'

// Mantener pulsado: se cancela si el dedo se mueve (scroll) o se suelta antes de tiempo
function useLongPress(onLongPress: () => void) {
  const timer = useRef<number | undefined>(undefined)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const [pressing, setPressing] = useState(false)

  const cancel = () => {
    window.clearTimeout(timer.current)
    origin.current = null
    setPressing(false)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return {
    pressing,
    handlers: {
      onPointerDown: (e: ReactPointerEvent) => {
        if (e.button !== 0) return
        origin.current = { x: e.clientX, y: e.clientY }
        setPressing(true)
        timer.current = window.setTimeout(() => {
          cancel()
          navigator.vibrate?.(30)
          onLongPress()
        }, LONG_PRESS_MS)
      },
      onPointerMove: (e: ReactPointerEvent) => {
        if (origin.current && Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > 10) cancel()
      },
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onContextMenu: (e: ReactMouseEvent) => e.preventDefault(),
    },
  }
}

// Con 2 estados, el borde y el fondo se parten en diagonal con los dos colores
function cardColors(statuses: Status[]) {
  const [a, b] = statuses.map(x => STATUS_STYLE[x])
  if (!a) return { border: `2px solid ${STATUS_STYLE.pending.color}`, background: STATUS_STYLE.pending.bg }
  if (!b) return { border: `2px solid ${a.color}`, background: a.bg }
  return {
    border: '2px solid transparent',
    background: `linear-gradient(135deg, ${a.bg} 50%, ${b.bg} 50%) padding-box, linear-gradient(135deg, ${a.color} 50%, ${b.color} 50%) border-box`,
  }
}

function WorkCard({ p, statuses, prices, onOpen }: { p: Product; statuses: Status[]; prices: Prices; onOpen: () => void }) {
  const { pressing, handlers } = useLongPress(onOpen)
  const isDelete = statuses.includes('delete')
  const orig = originalPrices(p)
  const edited = (Object.keys(prices) as PriceKey[]).length > 0

  return (
    <div
      {...handlers}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      style={{
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        ...cardColors(statuses),
        transform: pressing ? 'scale(0.96)' : 'scale(1)',
        transition: `transform ${pressing ? LONG_PRESS_MS : 150}ms ease, border-color 0.2s, background 0.2s`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
      }}
    >
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', flexWrap: 'wrap', gap: 4, zIndex: 2 }}>
        {statuses.map(x => (
          <span key={x} style={{ background: STATUS_STYLE[x].color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>{STATUS_STYLE[x].label}</span>
        ))}
        {edited && (
          <span style={{ background: 'var(--gold)', color: '#111', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>$ Precio editado</span>
        )}
      </div>

      <img
        src={p.image}
        alt={p.name}
        draggable={false}
        style={{
          width: '100%',
          height: 180,
          objectFit: 'contain',
          background: '#0f0f0f',
          padding: 8,
          opacity: isDelete ? 0.45 : 1,
          pointerEvents: 'none',
        }}
      />

      <div style={{ padding: '8px 10px' }}>
        <div style={{
          fontSize: 11,
          color: genderColor(p.gender),
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
          textDecoration: isDelete ? 'line-through' : 'none',
        }}>
          {p.name}
        </div>
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>
          ID: {p.id} · {genderLabel(p.gender)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 11, flexWrap: 'wrap' }}>
          {(['bottle', 'd10', 'd5'] as const).map(k => (
            <span key={k} style={{ color: prices[k] !== undefined ? 'var(--gold)' : '#a1a1aa', fontWeight: prices[k] !== undefined ? 700 : 400 }}>
              {PRICE_LABELS[k]} {money(prices[k] ?? orig[k])}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function OptionsPanel({ p, statuses, prices, onToggleStatus, onPrices, onClose }: {
  p: Product
  statuses: Status[]
  prices: Prices
  onToggleStatus: (s: Status) => void
  onPrices: (prices: Prices) => void
  onClose: () => void
}) {
  const orig = originalPrices(p)
  const [draft, setDraft] = useState<Record<PriceKey, string>>(() => ({
    bottle: String(prices.bottle ?? orig.bottle ?? ''),
    d10: String(prices.d10 ?? orig.d10 ?? ''),
    d5: String(prices.d5 ?? orig.d5 ?? ''),
  }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = () => {
    const next: Prices = {}
    for (const k of ['bottle', 'd10', 'd5'] as const) {
      const v = draft[k].trim() === '' ? undefined : Number(draft[k])
      if (v !== undefined && (Number.isNaN(v) || v < 0)) { alert(`Precio inválido en ${PRICE_LABELS[k]}`); return }
      if (v !== orig[k]) next[k] = v
    }
    onPrices(next)
    onClose()
  }

  const bottleLabel = p.sizes.find(s => !s.label.includes('Decant'))?.label

  const statusBtn = (s: Status) => {
    const active = statuses.includes(s)
    const full = !active && statuses.length >= MAX_STATUSES
    const st = STATUS_STYLE[s]
    return (
      <button
        key={s}
        onClick={() => onToggleStatus(s)}
        disabled={full}
        title={full ? `Máximo ${MAX_STATUSES} estados: quita uno primero` : undefined}
        aria-pressed={active}
        style={{
          flex: 1,
          minWidth: 0,
          padding: '12px 6px',
          lineHeight: 1.25,
          borderRadius: 8,
          border: `2px solid ${st.color}`,
          background: active ? st.color : 'transparent',
          color: active ? '#fff' : st.color,
          cursor: full ? 'not-allowed' : 'pointer',
          opacity: full ? 0.35 : 1,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {active ? `✓ ${st.label}` : st.label}
      </button>
    )
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      className="anim-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={`Opciones de ${p.name}`}
        style={{ width: '100%', maxWidth: 420, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', background: '#18181b', color: '#e4e4e7', borderRadius: 14, border: '1px solid #3f3f46', padding: 20 }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          <img src={p.image} alt="" style={{ width: 56, height: 56, objectFit: 'contain', background: '#0f0f0f', borderRadius: 8 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: genderColor(p.gender), fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.brand}</div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#71717a' }}>ID: {p.id}</div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: 'none', background: 'none', color: '#a1a1aa', fontSize: 22, cursor: 'pointer', alignSelf: 'flex-start' }}>✕</button>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#71717a', marginBottom: 8 }}>Estado <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>· hasta {MAX_STATUSES}</span></p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {STATUSES.map(statusBtn)}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#71717a', marginBottom: 8 }}>Precios</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 8 }}>
          {(['bottle', 'd10', 'd5'] as const).map(k => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#a1a1aa' }}>
              {k === 'bottle' && bottleLabel ? `Botella ${bottleLabel.match(/^\d+ ml/)?.[0] ?? ''}` : PRICE_LABELS[k]}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }}>$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.5"
                  value={draft[k]}
                  placeholder="—"
                  onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 8px 10px 22px', borderRadius: 8, border: `1px solid ${prices[k] !== undefined ? 'var(--gold)' : '#3f3f46'}`, background: '#0f0f0f', color: '#fff', fontSize: 16, outline: 'none' }}
                />
              </div>
              <span style={{ fontSize: 10, color: '#52525b' }}>Original: {money(orig[k])}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={() => setDraft({ bottle: String(orig.bottle ?? ''), d10: String(orig.d10 ?? ''), d5: String(orig.d5 ?? '') })}
            style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #3f3f46', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Restaurar
          </button>
          <button onClick={save} className="btn-gold" style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13 }}>
            Guardar precios
          </button>
        </div>
      </div>
    </div>
  )
}

function buildExport(state: WorkState): string {
  const byId = new Map(PRODUCTS.map(p => [p.id, p]))
  const ids = (s: Status) => Object.entries(state.status).filter(([, v]) => v.includes(s)).map(([id]) => byId.get(Number(id))).filter((p): p is Product => !!p)
  const lines: string[] = []
  for (const s of STATUSES) {
    const list = ids(s)
    lines.push(`${EXPORT_TITLE[s]} (${list.length})`)
    list.forEach(p => lines.push(`- ${fullName(p)} (ID ${p.id})`))
    lines.push('')
  }
  const priced = Object.entries(state.prices).filter(([, v]) => Object.keys(v).length > 0)
  lines.push(`PRECIOS (${priced.length})`)
  for (const [id, pr] of priced) {
    const p = byId.get(Number(id))
    if (!p) continue
    const orig = originalPrices(p)
    const changes = (Object.keys(pr) as PriceKey[]).map(k => `${PRICE_LABELS[k]} ${money(orig[k])} → ${money(pr[k])}`)
    lines.push(`- ${fullName(p)} (ID ${p.id}): ${changes.join(' · ')}`)
  }
  return lines.join('\n')
}

type Filter = 'all' | 'pending' | Status | 'priced'

export function WorkListPage() {
  const [state, setState] = useState<WorkState>(loadState)
  const [filter, setFilter] = useState<Filter>('all')
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women' | 'unisex'>('all')
  const [openId, setOpenId] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* sin almacenamiento */ }
  }, [state])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(t)
  }, [toast])

  const toggleStatus = (id: number, s: Status) => {
    setState(prev => {
      const current = prev.status[id] ?? []
      const next = current.includes(s)
        ? current.filter(x => x !== s)
        : current.length < MAX_STATUSES ? STATUSES.filter(x => x === s || current.includes(x)) : current
      const status = { ...prev.status }
      if (next.length > 0) status[id] = next
      else delete status[id]
      return { ...prev, status }
    })
  }

  const statusesOf = (id: number) => state.status[id] ?? []

  const setPrices = (id: number, pr: Prices) => {
    setState(prev => {
      const prices = { ...prev.prices }
      if (Object.keys(pr).length > 0) prices[id] = pr
      else delete prices[id]
      return { ...prev, prices }
    })
  }

  const isPriced = (id: number) => Object.keys(state.prices[id] ?? {}).length > 0

  const filtered = PRODUCTS.filter(p => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false
    if (filter === 'pending') return statusesOf(p.id).length === 0
    if (filter !== 'all' && filter !== 'priced') return statusesOf(p.id).includes(filter)
    if (filter === 'priced') return isPriced(p.id)
    return true
  })

  const counts = {
    all: PRODUCTS.length,
    pending: PRODUCTS.filter(p => statusesOf(p.id).length === 0).length,
    delete: PRODUCTS.filter(p => statusesOf(p.id).includes('delete')).length,
    photos: PRODUCTS.filter(p => statusesOf(p.id).includes('photos')).length,
    decants: PRODUCTS.filter(p => statusesOf(p.id).includes('decants')).length,
    priced: PRODUCTS.filter(p => isPriced(p.id)).length,
  }

  const filterBtn = (active: boolean, activeBg: string) => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    background: active ? activeBg : '#27272a',
    color: active ? '#fff' : '#a1a1aa',
  })

  const exportChanges = async () => {
    const text = buildExport(state)
    try {
      await navigator.clipboard.writeText(text)
      setToast('Cambios copiados. Pégalos en el chat para aplicarlos a la tienda.')
    } catch {
      window.prompt('Copia los cambios:', text)
    }
  }

  const openProduct = PRODUCTS.find(p => p.id === openId)

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', paddingTop: 108 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        📋 Lista de Trabajo
      </h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        Mantén presionada una card para marcarla o editar sus precios.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {([
            ['all', 'Todos', '#52525b'],
            ['pending', 'Pendientes', '#52525b'],
            ['delete', '🗑 Eliminar', '#ef4444'],
            ['photos', '📷 Cambiar fotos', '#10b981'],
            ['decants', '🧪 Cambiar decants', '#a855f7'],
            ['priced', '$ Precio editado', '#a17d34'],
          ] as const).map(([f, label, bg]) => (
            <button key={f} onClick={() => setFilter(f)} style={filterBtn(filter === f, bg)}>
              {label} ({counts[f]})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'women', 'men', 'unisex'] as const).map(g => (
            <button key={g} onClick={() => setGenderFilter(g)} style={filterBtn(genderFilter === g, '#2563eb')}>
              {g === 'all' ? 'Todos' : g === 'women' ? '♀ Damas' : g === 'men' ? '♂ Caballeros' : '⚥ Unisex'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          <button
            onClick={exportChanges}
            className="btn-gold"
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13 }}
          >
            Exportar cambios
          </button>
          <button
            onClick={() => { if (confirm('¿Limpiar todas las marcas y precios editados?')) setState({ status: {}, prices: {} }) }}
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
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12,
      }}>
        {filtered.map(p => (
          <WorkCard key={p.id} p={p} statuses={statusesOf(p.id)} prices={state.prices[p.id] ?? {}} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', padding: '48px 0' }}>No hay perfumes en este filtro.</p>
      )}

      {openProduct && (
        <OptionsPanel
          key={openProduct.id}
          p={openProduct}
          statuses={statusesOf(openProduct.id)}
          prices={state.prices[openProduct.id] ?? {}}
          onToggleStatus={s => toggleStatus(openProduct.id, s)}
          onPrices={pr => setPrices(openProduct.id, pr)}
          onClose={() => setOpenId(null)}
        />
      )}

      {toast && (
        <div className="anim-fade-in" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#18181b', color: '#fff', border: '1px solid var(--gold)', padding: '12px 18px', borderRadius: 10, fontSize: 13, maxWidth: 'calc(100% - 32px)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
