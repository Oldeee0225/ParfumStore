import logo from '@/assets/Logo.jpeg'

// Cabecera con el logo de la tienda de fondo (Nosotros, Políticas)
export function LogoHeader({ alt }: { alt: string }) {
  return (
    <section style={{ position: 'relative', height: 'clamp(260px, 42vw, 420px)', background: '#fff', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      <img src={logo} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
    </section>
  )
}
