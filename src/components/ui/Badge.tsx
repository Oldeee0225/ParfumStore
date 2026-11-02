export type BadgeType = 'new' | 'sale' | 'best' | 'niche' | 'arabic' | 'soldout'

const COLORS: Record<BadgeType, string> = {
  new: 'background:#C8A45D;color:#111',
  sale: 'background:#E53935;color:#fff',
  best: 'background:#111;color:#C8A45D',
  niche: 'background:#2d1e4f;color:#C8A45D',
  arabic: 'background:#1e3a2f;color:#C8A45D',
  soldout: 'background:#E53935;color:#fff',
}

export function Badge({ label, type }: { label: string; type: BadgeType }) {
  const [bg, fg] = COLORS[type].split(';').map(s => s.split(':')[1])
  return (
    <span style={{ background: bg, color: fg, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 2, textTransform: 'uppercase' }}>
      {label}
    </span>
  )
}
