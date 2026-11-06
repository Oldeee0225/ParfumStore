import { useNavigate } from 'react-router-dom'
import logo from '@/assets/Logo.jpeg'
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/data/contact'

const FOOTER_COLUMNS = [
  {
    title: 'Información',
    links: [
      { l: 'Nosotros', p: '/nosotros' },
      { l: 'Nuestras Marcas', p: '/marcas' },
      { l: 'Envíos y Seguridad', p: '/politicas' },
    ],
  },
]

export function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{ background: '#0a0a0a', color: 'rgba(255,255,255,0.65)', paddingTop: 'clamp(48px,8vw,80px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,5vw,80px)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, marginBottom: 48 }} className="r-stack">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <img src={logo} alt="Elegant Parfum Pty" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>Elegant Parfum Pty</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 20, maxWidth: 300 }}>
            Tu destino de confianza para perfumes originales de diseñador, fragancias nicho, perfumes árabes y decants de lujo. Autenticidad garantizada en cada fragancia.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginBottom: 16 }}>
            WhatsApp: <span style={{ color: 'var(--gold)' }}>{WHATSAPP_DISPLAY}</span>
          </a>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              {
                name: 'Instagram',
                url: INSTAGRAM_URL,
                icon: <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zM12 0C8.7 0 8.3 0 7 .1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4C1.2 2.7.8 3.4.5 4.2.2 5 .1 5.9 0 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.2.3 2.1.6 2.9.3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 2.9.6C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c1.2-.1 2.1-.3 2.9-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.2-.3-2.1-.6-2.9-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.7-.5-2.9-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.8-10.4a1.45 1.45 0 1 1-2.9 0 1.45 1.45 0 0 1 2.9 0z" />,
              },
              {
                name: 'TikTok',
                url: TIKTOK_URL,
                icon: <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
              },
              {
                name: 'WhatsApp',
                url: WHATSAPP_URL,
                icon: <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 7c0 5.44-4.44 9.87-9.9 9.87zm8.42-18.28A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.33-1.66a11.88 11.88 0 0 0 5.66 1.44h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.48-8.37z" />,
              },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)' }}>
                <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden="true">{s.icon}</svg>
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map(col => (
          <div key={col.title}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>{col.title}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map(link => (
                <li key={link.l}>
                  <button onClick={() => navigate(link.p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', padding: 0, transition: 'color 0.2s', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                    {link.l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </footer>
  )
}
