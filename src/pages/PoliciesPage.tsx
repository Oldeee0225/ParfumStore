import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'
import { LogoHeader } from '@/components/ui/LogoHeader'
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/data/contact'

const SECTIONS = [
  {
    id: 'envios',
    label: 'Políticas de envío',
    title: 'Envíos',
    items: [
      { icon: '🚚', title: 'Envíos nacionales', text: 'Realizamos envíos a toda la República de Panamá. En la Ciudad de Panamá también coordinamos entregas a domicilio.' },
      { icon: '⏱', title: 'Tiempo de preparación', text: 'Preparamos tu pedido en un plazo de 24 horas hábiles después de confirmar el pago. Los decants se preparan al momento, por eso pueden tomar un poco más.' },
      { icon: '💬', title: 'Costo y coordinación', text: 'El costo del envío depende de la zona y se acuerda contigo por WhatsApp antes de confirmar el pedido. Ahí también te indicamos la fecha estimada de entrega.' },
      { icon: '📦', title: 'Empaque protegido', text: 'Cada perfume y decant se empaca con protección para que llegue en perfectas condiciones. Los decants van sellados y etiquetados con el nombre de la fragancia.' },
      { icon: '📍', title: 'Seguimiento', text: 'Te mantenemos informado por WhatsApp desde que tu pedido sale hasta que lo recibes. Si usas un servicio de encomienda, te compartimos el comprobante de envío.' },
    ],
  },
  {
    id: 'seguridad',
    label: 'Políticas de seguridad',
    title: 'Seguridad',
    items: [
      { icon: '✓', title: 'Perfumes 100% originales', text: 'Todas nuestras fragancias son originales. Los decants se extraen directamente de botellas originales, sin mezclas ni diluciones.' },
      { icon: '🔒', title: 'Pagos seguros', text: 'La web no procesa pagos ni solicita datos de tarjetas. El pago se coordina directamente con un asesor por WhatsApp mediante Yappy o transferencia bancaria.' },
      { icon: '🛡', title: 'Protección de tus datos', text: 'Tu nombre, teléfono y dirección se usan únicamente para preparar y entregar tu pedido. No compartimos tu información con terceros.' },
      { icon: '⚠', title: 'Canales oficiales', text: `Solo atendemos pedidos por nuestro WhatsApp oficial ${WHATSAPP_DISPLAY} y nuestras redes oficiales. Nunca te pediremos contraseñas ni códigos de verificación.` },
    ],
  },
]

export function PoliciesPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <LogoHeader alt="Elegant Parfum Pty" />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel text="Compra con confianza" />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'var(--fg)', fontWeight: 600, margin: 0 }}>Envíos y Seguridad</h1>
          <GoldLine center />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{ padding: '9px 18px', borderRadius: 999, border: '1px solid var(--border)', color: 'var(--fg2)', fontSize: '0.8rem', letterSpacing: '0.06em' }}>{s.label}</a>
            ))}
          </div>
        </div>

        {SECTIONS.map(section => (
          <section key={section.id} id={section.id} style={{ marginBottom: 64, scrollMarginTop: 120 }}>
            <SectionLabel text={section.label} />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--fg)', fontWeight: 600, margin: 0 }}>{section.title}</h2>
            <GoldLine />
            <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginTop: 32 }}>
              {section.items.map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 18, padding: 24, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--fg)', fontWeight: 600, margin: '0 0 8px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--fg2)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div style={{ textAlign: 'center', padding: 'clamp(28px,5vw,44px)', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: 'var(--fg)', fontWeight: 600, margin: '0 0 10px' }}>¿Tienes alguna duda sobre tu pedido?</h3>
          <p style={{ color: 'var(--fg2)', fontSize: '0.9rem', margin: '0 0 22px' }}>Escríbenos y te atendemos personalmente.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ display: 'inline-block', padding: '14px 30px', borderRadius: 6, fontSize: '0.82rem' }}>
            WHATSAPP {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  )
}
