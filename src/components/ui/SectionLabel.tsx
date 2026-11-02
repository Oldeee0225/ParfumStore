export function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ color: 'var(--gold)', fontFamily: "'Inter',sans-serif", fontSize: '0.7rem', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
      {text}
    </p>
  )
}
