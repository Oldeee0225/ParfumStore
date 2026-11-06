import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'
import { LogoHeader } from '@/components/ui/LogoHeader'

export function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <LogoHeader alt="Elegant Parfum Pty" />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel text="Quiénes somos" />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--fg)', fontWeight: 600, margin: 0 }}>Nuestra Historia</h1>
          <GoldLine center />
          <div style={{ height: 28 }} />
          <p style={{ color: 'var(--fg2)', fontSize: '1.05rem', lineHeight: 1.9, maxWidth: 700, margin: '0 auto' }}>
            Elegant Parfum Pty nació de una pasión profunda por las fragancias de lujo y el deseo de hacer accesible lo extraordinario. Somos una perfumería especializada en ofrecer las mejores fragancias del mundo con garantía absoluta de autenticidad.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 32, marginBottom: 64 }}>
          {[
            { title: 'Nuestra Misión', icon: '◈', text: 'Conectar a los amantes de las fragancias con las mejores creaciones olfativas del mundo, ofreciendo autenticidad, conocimiento experto y una experiencia de compra excepcional.' },
            { title: 'Nuestra Visión', icon: '◎', text: 'Ser la perfumería online de referencia en Latinoamérica, reconocida por nuestra curación experta, servicio personalizado y la más amplia selección de fragancias de lujo.' },
            { title: 'Nuestros Valores', icon: '✦', text: 'Autenticidad en cada producto. Transparencia en cada transacción. Pasión por cada fragancia. Excelencia en cada interacción con nuestros clientes.' },
          ].map(v => (
            <div key={v.title} style={{ padding: 32, background: 'var(--bg2)', borderRadius: 16, textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 28, color: 'var(--gold)', marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 12 }}>{v.title}</h3>
              <GoldLine center />
              <p style={{ color: 'var(--fg2)', fontSize: '0.9rem', lineHeight: 1.8, marginTop: 16 }}>{v.text}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--fg)', textAlign: 'center', marginBottom: 16, fontWeight: 600 }}>Por qué elegirnos</h2>
        <GoldLine center />
        <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginTop: 36 }}>
          {[
            { icon: '✓', title: 'Garantía de Autenticidad', desc: 'Cada producto cuenta con certificado de autenticidad. Compramos directamente a distribuidores oficiales y casas de perfumes reconocidas mundialmente.' },
            { icon: '■', title: 'Empaque Premium', desc: 'Cada pedido se entrega en una elegante caja negra con separadores de lujo, papel tissue dorado y tarjeta de fragancia con las notas olfativas.' },
            { icon: '⚡', title: 'Envíos Seguros y Rápidos', desc: 'Procesamos tu pedido en 24 horas. Envío express en 2-3 días hábiles. Cada paquete lleva seguro de envío completo.' },
            { icon: '✉', title: 'Atención Personalizada', desc: 'Nuestros expertos en fragancias están disponibles para asesorarte en la elección perfecta, ya sea por WhatsApp, Instagram o TikTok.' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 20, padding: 24, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--fg2)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
