import { useState, type FormEvent } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GoldLine } from '@/components/ui/GoldLine'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    { q: '¿Cómo garantizan la autenticidad?', a: 'Compramos directamente a distribuidores oficiales y casas perfumistas. Cada producto incluye todos sus sellos, empaques y documentos originales.' },
    { q: '¿Cuánto tarda el envío?', a: 'Procesamos tu pedido en 24 horas hábiles. El envío express tarda 2-3 días hábiles dentro del país. Envíos internacionales en 5-7 días hábiles.' },
    { q: '¿Qué es un decant?', a: 'Un decant es una muestra auténtica de un perfume original, envasada en un atomizador de 5 ml o 10 ml. Perfecta para probar una fragancia antes de comprar la botella completa.' },
    { q: '¿Tienen tienda física?', a: 'Somos una tienda 100% online, lo que nos permite mantener precios más competitivos. Sin embargo, ofrecemos atención personalizada por WhatsApp, videollamada o chat.' },
    { q: '¿Hacen envíos internacionales?', a: 'Sí, enviamos a toda Latinoamérica y España. Los costos y tiempos de envío varían según el destino. Consulta los detalles en el checkout.' },
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <div style={{ background: 'var(--bg2)', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <SectionLabel text="Estamos aquí para ayudarte" />
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--fg)', fontWeight: 600 }}>Contáctanos</h1>
        <GoldLine center />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,80px)' }}>
        <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 8 }}>Información de Contacto</h2>
            <GoldLine />
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: '📱', label: 'WhatsApp', value: '+1 (555) 123-4567', sub: 'Lunes a Sábado, 9am - 8pm' },
                { icon: '✉', label: 'Correo Electrónico', value: 'hola@elegantparfumpty.com', sub: 'Respondemos en menos de 2 horas' },
                { icon: '📍', label: 'Ubicación', value: 'Servicio en toda Latinoamérica', sub: 'Tienda 100% online' },
                { icon: '⏰', label: 'Horario de Atención', value: 'Lun – Sáb: 9:00 am – 8:00 pm', sub: 'Dom: 10:00 am – 4:00 pm' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(200,164,93,0.1)', border: '1px solid rgba(200,164,93,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</p>
                    <p style={{ fontSize: '0.92rem', color: 'var(--fg)', fontWeight: 500, overflowWrap: 'anywhere' }}>{item.value}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginTop: 2 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36, paddingTop: 36, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--fg3)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>Síguenos</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['IG', 'FB', 'TT', 'YT'].map(s => (
                  <button key={s} style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--fg2)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg2)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--fg)', fontWeight: 600, marginBottom: 8 }}>Envíanos un Mensaje</h2>
            <GoldLine />
            {sent ? (
              <div style={{ marginTop: 32, padding: 32, background: 'rgba(200,164,93,0.08)', border: '1px solid rgba(200,164,93,0.3)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--fg)', fontSize: '1.3rem', marginBottom: 8 }}>¡Mensaje enviado!</h3>
                <p style={{ color: 'var(--fg2)', fontSize: '0.9rem' }}>Te contactaremos en menos de 2 horas hábiles. Gracias por escribirnos.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="r-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { field: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre' },
                    { field: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@email.com' },
                  ].map(f => (
                    <div key={f.field}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>{f.label}</label>
                      <input type={f.type} value={form[f.field as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))} placeholder={f.placeholder} required
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Asunto</label>
                  <select value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))} required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.88rem', outline: 'none' }}>
                    <option value="">Seleccionar...</option>
                    <option>Consulta sobre un perfume</option>
                    <option>Estado de mi pedido</option>
                    <option>Asesoría de fragrancias</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Mensaje</label>
                  <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} rows={5} placeholder="Cuéntanos cómo podemos ayudarte..." required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.88rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                </div>
                <button type="submit" className="btn-gold" style={{ padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer' }}>ENVIAR MENSAJE</button>
              </form>
            )}
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="Respuestas rápidas" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--fg)', fontWeight: 600 }}>Preguntas Frecuentes</h2>
            <GoldLine center />
          </div>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.98rem', color: 'var(--fg)', fontWeight: 600 }}>{faq.q}</span>
                  <span style={{ color: 'var(--gold)', fontSize: '1.2rem', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{ color: 'var(--fg2)', fontSize: '0.88rem', lineHeight: 1.75 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
