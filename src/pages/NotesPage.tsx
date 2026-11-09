import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import { NOTE_IMAGES, getNoteImage, cleanNoteName } from '../data/notes'
import type { Product } from '@/types'
import { useLongPress, LONG_PRESS_MS } from '@/hooks/useLongPress'
import { fullName, genderLabel, genderColor } from '@/utils/catalog'

const STORAGE_KEY = 'notes-worklist-v1'

type Layer = 'top' | 'heart' | 'base'
type Notes = Record<Layer, string[]>
type Edits = Record<number, Partial<Notes>>

const LAYERS: { key: Layer; label: string; short: string }[] = [
  { key: 'top', label: 'Salida', short: 'S' },
  { key: 'heart', label: 'Corazón', short: 'C' },
  { key: 'base', label: 'Fondo', short: 'F' },
]

const GOLD = 'var(--gold)'
const WARN = '#f59e0b'

// Misma normalización que usa la ficha del producto para buscar la foto de la nota
const noteKey = (n: string) => cleanNoteName(n).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const hasImage = (n: string) => getNoteImage(n) !== null
const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i])
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const allOf = (n: Notes) => [...n.top, ...n.heart, ...n.base]

function originalNotes(p: Product): Notes {
  const clean = (list: string[]) => list.map(cleanNoteName).filter(Boolean)
  return { top: clean(p.topNotes), heart: clean(p.heartNotes), base: clean(p.baseNotes) }
}

function currentNotes(p: Product, edits: Partial<Notes> = {}): Notes {
  const orig = originalNotes(p)
  return { top: edits.top ?? orig.top, heart: edits.heart ?? orig.heart, base: edits.base ?? orig.base }
}

// Guarda solo las capas que difieren del catálogo
function diffFromCatalog(p: Product, notes: Notes): Partial<Notes> {
  const orig = originalNotes(p)
  const out: Partial<Notes> = {}
  for (const { key } of LAYERS) if (!sameList(notes[key], orig[key])) out[key] = notes[key]
  return out
}

function withEdit(edits: Edits, p: Product, notes: Notes): Edits {
  const next = { ...edits }
  const d = diffFromCatalog(p, notes)
  if (Object.keys(d).length > 0) next[p.id] = d
  else delete next[p.id]
  return next
}

function loadEdits(): Edits {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = (raw ? JSON.parse(raw) : {}) as Record<string, Partial<Notes>>
    const byId = new Map(PRODUCTS.map(p => [p.id, p]))
    let edits: Edits = {}
    for (const [id, e] of Object.entries(parsed)) {
      const p = byId.get(Number(id))
      // Cambios que ya se aplicaron al catálogo dejan de contar como "editados"
      if (p) edits = withEdit(edits, p, currentNotes(p, e))
    }
    return edits
  } catch {
    return {}
  }
}

// Todas las notas en uso, sin repetir, para autocompletar
function allNotes(edits: Edits): string[] {
  const seen = new Map<string, string>()
  for (const p of PRODUCTS) {
    for (const x of allOf(currentNotes(p, edits[p.id]))) if (!seen.has(noteKey(x))) seen.set(noteKey(x), x)
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, 'es'))
}

function NoteThumb({ name, size = 22 }: { name: string; size?: number }) {
  const img = getNoteImage(name)
  return (
    <span style={{ width: size, height: size, flexShrink: 0, borderRadius: '50%', overflow: 'hidden', background: img ? '#f0ede8' : '#3a2a0a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 700, color: WARN }}>
      {img ? <img src={img} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '!'}
    </span>
  )
}

function NoteCard({ p, edits, onOpen }: { p: Product; edits: Partial<Notes>; onOpen: () => void }) {
  const { pressing, handlers } = useLongPress(onOpen)
  const notes = currentNotes(p, edits)
  const edited = Object.keys(edits).length > 0
  const missing = allOf(notes).filter(n => !hasImage(n)).length

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
        border: `2px solid ${edited ? GOLD : '#27272a'}`,
        background: edited ? '#221c0e' : '#18181b',
        transform: pressing ? 'scale(0.96)' : 'scale(1)',
        transition: `transform ${pressing ? LONG_PRESS_MS : 150}ms ease, border-color 0.2s, background 0.2s`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
      }}
    >
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', flexWrap: 'wrap', gap: 4, zIndex: 2 }}>
        {edited && <span style={{ background: GOLD, color: '#111', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>✎ Notas editadas</span>}
        {missing > 0 && <span style={{ background: WARN, color: '#111', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>{missing} sin foto</span>}
      </div>

      <img loading="lazy" decoding="async" src={p.image} alt={p.name} draggable={false}
        style={{ width: '100%', height: 150, objectFit: 'contain', background: '#0f0f0f', padding: 8, pointerEvents: 'none' }} />

      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 11, color: genderColor(p.gender), fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', lineHeight: 1.3, marginTop: 2 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>ID: {p.id} · {genderLabel(p.gender)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
          {LAYERS.map(({ key, short, label }) => (
            <div key={key} title={label} style={{ fontSize: 11, lineHeight: 1.35, color: edits[key] ? GOLD : '#a1a1aa', fontWeight: edits[key] ? 600 : 400 }}>
              <b style={{ color: '#52525b', marginRight: 4 }}>{short}</b>
              {notes[key].length ? notes[key].join(', ') : <i style={{ color: '#52525b' }}>sin notas</i>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Lista propia (no <datalist>) para que se vea igual en celular: todas las notas, filtradas al escribir
function NotePicker({ query, suggestions, selected, onToggle, onAddNew }: {
  query: string
  suggestions: string[]
  selected: string[]
  onToggle: (name: string) => void
  onAddNew: () => void
}) {
  const q = noteKey(query.split(',').pop() ?? '')
  const chosen = new Set(selected.map(noteKey))
  const list = q ? suggestions.filter(s => noteKey(s).includes(q)) : suggestions
  const exact = q !== '' && suggestions.some(s => noteKey(s) === q)

  return (
    <div style={{ marginTop: 6, border: '1px solid #3f3f46', borderRadius: 8, background: '#0f0f0f', overflow: 'hidden' }}>
      <div style={{ padding: '6px 10px', fontSize: 11, color: '#71717a', borderBottom: '1px solid #27272a' }}>
        {q ? `${list.length} coincidencia${list.length === 1 ? '' : 's'}` : `${suggestions.length} notas`} · toca para agregar o quitar
      </div>
      <div style={{ maxHeight: 240, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2, padding: 4 }}>
        {query.trim() && !exact && (
          <button onClick={onAddNew}
            style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 6, border: `1px dashed ${GOLD}`, background: 'transparent', color: GOLD, cursor: 'pointer', fontSize: 13, textAlign: 'left' }}>
            + Agregar «{query.trim()}» como nota nueva
          </button>
        )}
        {list.map(s => {
          const on = chosen.has(noteKey(s))
          return (
            <button key={s} onClick={() => onToggle(s)} aria-pressed={on}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, border: 'none', background: on ? '#2a2310' : 'transparent', color: on ? GOLD : '#e4e4e7', cursor: 'pointer', fontSize: 13, textAlign: 'left', minWidth: 0 }}>
              <NoteThumb name={s} size={26} />
              <span style={{ flex: 1, minWidth: 0, lineHeight: 1.2, overflowWrap: 'anywhere' }}>{s}</span>
              {on && <span aria-hidden>✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function NotesEditor({ p, edits, suggestions, onSave, onClose }: {
  p: Product
  edits: Partial<Notes>
  suggestions: string[]
  onSave: (notes: Notes) => void
  onClose: () => void
}) {
  const orig = originalNotes(p)
  const [draft, setDraft] = useState<Notes>(() => currentNotes(p, edits))
  const [inputs, setInputs] = useState<Record<Layer, string>>({ top: '', heart: '', base: '' })
  const [active, setActive] = useState<Layer | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const byKey = useMemo(() => new Map(suggestions.map(s => [noteKey(s), s])), [suggestions])

  const addNames = (layer: Layer, names: string[]) => {
    setDraft(d => {
      const keys = new Set(d[layer].map(noteKey))
      const fresh = names.filter(n => { const k = noteKey(n); if (!k || keys.has(k)) return false; keys.add(k); return true })
      return { ...d, [layer]: [...d[layer], ...fresh] }
    })
    setInputs(i => ({ ...i, [layer]: '' }))
  }

  // Se pueden pegar varias separadas por coma; si ya existe en el catálogo se usa ese nombre exacto
  const addTyped = (layer: Layer) => {
    const names = inputs[layer].split(',').map(s => s.trim()).filter(Boolean).map(s => byKey.get(noteKey(s)) ?? capitalize(s))
    if (names.length > 0) addNames(layer, names)
  }

  // Quitar si ya está en la capa, agregar si no
  const toggle = (layer: Layer, name: string) => setDraft(d => {
    const k = noteKey(name)
    return d[layer].some(n => noteKey(n) === k)
      ? { ...d, [layer]: d[layer].filter(n => noteKey(n) !== k) }
      : { ...d, [layer]: [...d[layer], name] }
  })

  const remove = (layer: Layer, idx: number) => setDraft(d => ({ ...d, [layer]: d[layer].filter((_, i) => i !== idx) }))

  const move = (from: Layer, idx: number, to: Layer) => setDraft(d => {
    const note = d[from][idx]
    const rest = d[from].filter((_, i) => i !== idx)
    const already = d[to].some(n => noteKey(n) === noteKey(note))
    return { ...d, [from]: rest, [to]: already ? d[to] : [...d[to], note] }
  })

  return (
    <div onClick={onClose} className="anim-fade-in"
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-label={`Notas de ${p.name}`}
        style={{ width: '100%', maxWidth: 520, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', background: '#18181b', color: '#e4e4e7', borderRadius: 14, border: '1px solid #3f3f46', padding: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          <img loading="lazy" decoding="async" src={p.image} alt="" style={{ width: 56, height: 56, objectFit: 'contain', background: '#0f0f0f', borderRadius: 8 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: genderColor(p.gender), fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.brand}</div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#71717a' }}>ID: {p.id}</div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: 'none', background: 'none', color: '#a1a1aa', fontSize: 22, cursor: 'pointer', alignSelf: 'flex-start' }}>✕</button>
        </div>

        {LAYERS.map(({ key, label }) => {
          const changed = !sameList(draft[key], orig[key])
          const others = LAYERS.filter(l => l.key !== key)
          return (
            <div key={key} style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: changed ? GOLD : '#71717a', marginBottom: 8 }}>
                {label} {changed && <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>· editado</span>}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 30 }}>
                {draft[key].length === 0 && <span style={{ fontSize: 12, color: '#52525b', alignSelf: 'center' }}>Sin notas</span>}
                {draft[key].map((n, i) => (
                  <span key={n + i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 4px 3px 3px', borderRadius: 999, border: `1px solid ${hasImage(n) ? '#3f3f46' : WARN}`, background: '#0f0f0f', fontSize: 12 }}>
                    <NoteThumb name={n} />
                    {n}
                    <select
                      aria-label={`Mover ${n} a otra capa`}
                      title="Mover a otra capa"
                      value=""
                      onChange={e => move(key, i, e.target.value as Layer)}
                      style={{ appearance: 'none', WebkitAppearance: 'none', background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: 13, cursor: 'pointer', width: 16, padding: 0, textAlign: 'center' }}
                    >
                      <option value="" disabled>⇄</option>
                      {others.map(o => <option key={o.key} value={o.key}>Mover a {o.label}</option>)}
                    </select>
                    <button onClick={() => remove(key, i)} aria-label={`Quitar ${n}`}
                      style={{ border: 'none', background: '#27272a', color: '#a1a1aa', borderRadius: '50%', width: 18, height: 18, fontSize: 11, lineHeight: '18px', cursor: 'pointer', padding: 0 }}>✕</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={inputs[key]}
                  placeholder={active === key ? 'Buscar o escribir nota nueva…' : 'Agregar nota (toca para ver la lista)'}
                  autoComplete="off"
                  onFocus={() => setActive(key)}
                  onChange={e => { setActive(key); setInputs(i => ({ ...i, [key]: e.target.value })) }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTyped(key) } }}
                  style={{ flex: 1, minWidth: 0, padding: '9px 10px', borderRadius: 8, border: `1px solid ${active === key ? GOLD : '#3f3f46'}`, background: '#0f0f0f', color: '#fff', fontSize: 16, outline: 'none' }}
                />
                {active === key
                  ? <button onClick={() => { setActive(null); setInputs(i => ({ ...i, [key]: '' })) }} style={{ padding: '0 12px', borderRadius: 8, border: '1px solid #3f3f46', background: '#27272a', color: '#e4e4e7', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Listo</button>
                  : <button onClick={() => setActive(key)} aria-label={`Ver notas para ${label}`} style={{ padding: '0 14px', borderRadius: 8, border: '1px solid #3f3f46', background: '#27272a', color: '#e4e4e7', cursor: 'pointer', fontSize: 16 }}>+</button>}
              </div>
              {active === key && (
                <NotePicker
                  query={inputs[key]}
                  suggestions={suggestions}
                  selected={draft[key]}
                  onToggle={name => toggle(key, name)}
                  onAddNew={() => addTyped(key)}
                />
              )}
              {changed && <p style={{ fontSize: 10, color: '#52525b', marginTop: 4 }}>Original: {orig[key].join(', ') || '—'}</p>}
            </div>
          )
        })}

        <p style={{ fontSize: 11, color: '#71717a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <NoteThumb name="" size={16} /> Borde naranja: la nota todavía no tiene foto.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setDraft(orig)}
            style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #3f3f46', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            Restaurar
          </button>
          <button onClick={() => { onSave(draft); onClose() }} className="btn-gold"
            style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13 }}>
            Guardar notas
          </button>
        </div>
      </div>
    </div>
  )
}

function buildExport(edits: Edits): string {
  const byId = new Map(PRODUCTS.map(p => [p.id, p]))
  const lines: string[] = []
  const missing = new Map<string, string>()
  let count = 0
  for (const [id, e] of Object.entries(edits)) {
    const p = byId.get(Number(id))
    if (!p) continue
    count++
    const orig = originalNotes(p)
    lines.push(`- ${fullName(p)} (ID ${p.id})`)
    for (const { key, label } of LAYERS) {
      const next = e[key]
      if (!next) continue
      lines.push(`  ${label}: ${orig[key].join(', ') || '—'} → ${next.join(', ') || '—'}`)
      next.filter(n => !hasImage(n)).forEach(n => missing.set(noteKey(n), n))
    }
  }
  lines.unshift(`NOTAS (${count})`)
  if (missing.size > 0) {
    lines.push('', `NOTAS SIN FOTO (${missing.size})`)
    for (const n of [...missing.values()].sort((a, b) => a.localeCompare(b, 'es'))) lines.push(`- ${n}`)
  }
  return lines.join('\n')
}

function NotesLibrary() {
  const [filter, setFilter] = useState('')
  const notesList = Object.entries(NOTE_IMAGES)
    .map(([id, img]) => ({ id, name: capitalize(id), img }))
    .sort((a, b) => a.name.localeCompare(b.name))
  const filtered = notesList.filter(n => n.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--fg3)' }}>
          Total de Notas: <b style={{ color: GOLD }}>{notesList.length}</b>
        </span>
        <input type="text" placeholder="Buscar nota..." value={filter} onChange={e => setFilter(e.target.value)}
          style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--fg)', fontSize: 13, outline: 'none' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {filtered.map(n => (
          <div key={n.id} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div style={{ width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ede8', padding: 20 }}>
              <img loading="lazy" decoding="async" src={n.img} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '12px 10px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--fg)', textTransform: 'capitalize' }}>{n.name}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--fg3)' }}>
            No se encontraron notas que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </>
  )
}

type Filter = 'all' | 'edited' | 'missing'

export function NotesPage() {
  const [tab, setTab] = useState<'perfumes' | 'library'>('perfumes')
  const [edits, setEdits] = useState<Edits>(loadEdits)
  const [filter, setFilter] = useState<Filter>('all')
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women' | 'unisex'>('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(edits)) } catch { /* sin almacenamiento */ }
  }, [edits])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(t)
  }, [toast])

  const suggestions = useMemo(() => allNotes(edits), [edits])

  const notesOf = (p: Product) => currentNotes(p, edits[p.id])
  const isEdited = (p: Product) => edits[p.id] !== undefined
  const isMissing = (p: Product) => allOf(notesOf(p)).some(x => !hasImage(x))

  const q = noteKey(search)
  const visible = PRODUCTS.filter(p => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false
    return !q || noteKey(`${p.brand} ${p.name}`).includes(q) || allOf(notesOf(p)).some(x => noteKey(x).includes(q))
  })
  const filtered = visible.filter(p => filter === 'edited' ? isEdited(p) : filter === 'missing' ? isMissing(p) : true)
  const counts: Record<Filter, number> = { all: visible.length, edited: visible.filter(isEdited).length, missing: visible.filter(isMissing).length }

  const exportChanges = async () => {
    if (Object.keys(edits).length === 0) { setToast('No hay notas editadas para exportar.'); return }
    const text = buildExport(edits)
    try {
      await navigator.clipboard.writeText(text)
      setToast('Cambios copiados. Pégalos en el chat para aplicarlos a la tienda.')
    } catch {
      window.prompt('Copia los cambios:', text)
    }
  }

  const filterBtn = (active: boolean, activeBg: string, darkText = false) => ({
    padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: active ? activeBg : '#27272a', color: active ? (darkText ? '#111' : '#fff') : '#a1a1aa',
  })

  const openProduct = PRODUCTS.find(p => p.id === openId)

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', paddingTop: 108 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: 'var(--fg)' }}>🍃 Notas Olfativas</h1>

      <div role="tablist" style={{ display: 'flex', gap: 6, margin: '12px 0 16px' }}>
        {([['perfumes', 'Editar por perfume'], ['library', 'Biblioteca de notas']] as const).map(([t, label]) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} style={filterBtn(tab === t, '#52525b')}>{label}</button>
        ))}
      </div>

      {tab === 'library' ? <NotesLibrary /> : (
        <>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
            Mantén presionada una card para editar sus notas. Las notas con borde naranja aún no tienen foto.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {([
                ['all', 'Todos', '#52525b', false],
                ['edited', '✎ Editados', GOLD, true],
                ['missing', 'Notas sin foto', WARN, true],
              ] as const).map(([f, label, bg, dark]) => (
                <button key={f} onClick={() => setFilter(f)} style={filterBtn(filter === f, bg, dark)}>{label} ({counts[f]})</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['all', 'women', 'men', 'unisex'] as const).map(g => (
                <button key={g} onClick={() => setGenderFilter(g)} style={filterBtn(genderFilter === g, '#2563eb')}>
                  {g === 'all' ? 'Todos' : g === 'women' ? '♀ Damas' : g === 'men' ? '♂ Caballeros' : '⚥ Unisex'}
                </button>
              ))}
            </div>

            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar perfume o nota..." aria-label="Buscar perfume o nota"
              style={{ flex: '1 1 180px', maxWidth: 260, padding: '7px 12px', borderRadius: 6, border: '1px solid #3f3f46', background: '#18181b', color: '#fff', fontSize: 13, outline: 'none' }} />

            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <button onClick={exportChanges} className="btn-gold" style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13 }}>
                Exportar cambios
              </button>
              <button
                onClick={() => { if (confirm('¿Descartar todas las notas editadas?')) setEdits({}) }}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Reset
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            {filtered.map(p => (
              <NoteCard key={p.id} p={p} edits={edits[p.id] ?? {}} onOpen={() => setOpenId(p.id)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', padding: '48px 0' }}>No hay perfumes en este filtro.</p>
          )}
        </>
      )}

      {openProduct && (
        <NotesEditor
          key={openProduct.id}
          p={openProduct}
          edits={edits[openProduct.id] ?? {}}
          suggestions={suggestions}
          onSave={notes => setEdits(prev => withEdit(prev, openProduct, notes))}
          onClose={() => setOpenId(null)}
        />
      )}

      {toast && (
        <div className="anim-fade-in" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#18181b', color: '#fff', border: `1px solid ${GOLD}`, padding: '12px 18px', borderRadius: 10, fontSize: 13, maxWidth: 'calc(100% - 32px)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
