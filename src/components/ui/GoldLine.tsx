export function GoldLine({ center }: { center?: boolean }) {
  return <div style={{ width: 52, height: 2, background: 'var(--gold)', margin: center ? '12px auto 0' : '12px 0 0' }} />
}
