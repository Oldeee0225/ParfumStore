import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/providers/CartProvider'
import { whatsappLink } from '@/data/contact'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items: cartItems, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [info, setInfo] = useState({ firstName: '', lastName: '', email: '' })
  const [address, setAddress] = useState({ street: '' })
  const [payment, setPayment] = useState({ method: 'efectivo' })

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal

  const steps = ['Información', 'Dirección', 'Pago', 'Confirmación']

  const renderStep = () => {
    if (step === 4) return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(200,164,93,0.1)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32, color: 'var(--gold)' }}>✓</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: 'var(--fg)', marginBottom: 12 }}>¡Pedido Confirmado!</h2>
        <p style={{ color: 'var(--fg2)', marginBottom: 8 }}>Tu número de pedido es: <strong style={{ color: 'var(--gold)' }}>#AUR-{Math.floor(Math.random() * 90000 + 10000)}</strong></p>
        <p style={{ color: 'var(--fg2)', fontSize: '0.9rem', marginBottom: 36 }}>Recibirás un correo de confirmación en {info.email || 'tu email'} con todos los detalles.</p>
        <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: 24, maxWidth: 360, margin: '0 auto 36px', textAlign: 'left' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--fg3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Resumen del pedido</p>
          {cartItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--fg2)', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{item.product.name} ({item.size})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--fg)', marginTop: 12, fontSize: '1rem' }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="btn-gold" style={{ padding: '13px 36px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>SEGUIR COMPRANDO</button>
      </div>
    )

    const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg2)', color: 'var(--fg)', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }
    const labelStyle: CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--fg3)', marginBottom: 6 }

    if (step === 1) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg)', marginBottom: 8 }}>Información del Cliente</h3>
        <div className="r-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={labelStyle}>Nombre</label><input style={inputStyle} value={info.firstName} onChange={e => setInfo(v => ({ ...v, firstName: e.target.value }))} placeholder="Tu nombre" /></div>
          <div><label style={labelStyle}>Apellido</label><input style={inputStyle} value={info.lastName} onChange={e => setInfo(v => ({ ...v, lastName: e.target.value }))} placeholder="Tu apellido" /></div>
        </div>
        <div><label style={labelStyle}>Correo electrónico</label><input type="email" style={inputStyle} value={info.email} onChange={e => setInfo(v => ({ ...v, email: e.target.value }))} placeholder="tu@email.com" /></div>
        <button onClick={() => setStep(2)} className="btn-gold" style={{ padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 8 }}>CONTINUAR A DIRECCIÓN</button>
      </div>
    )

    if (step === 2) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg)', marginBottom: 8 }}>Dirección de Envío</h3>
        <div><label style={labelStyle}>Dirección</label><input style={inputStyle} value={address.street} onChange={e => setAddress(v => ({ ...v, street: e.target.value }))} placeholder="Calle y número" /></div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '14px 0', borderRadius: 8, cursor: 'pointer' }}>ATRÁS</button>
          <button onClick={() => setStep(3)} className="btn-gold" style={{ flex: 2, padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer' }}>CONTINUAR AL PAGO</button>
        </div>
      </div>
    )

    if (step === 3) {
      const handleConfirm = () => {
        const itemsText = cartItems.map(i => `- ${i.product.name} (${i.size}) x${i.quantity}: $${(i.price * i.quantity).toFixed(2)}`).join('\n')
        const msg = `¡Hola! Quiero hacer un pedido.

*Datos del cliente:*
Nombre: ${info.firstName} ${info.lastName}
Correo: ${info.email}

*Dirección de envío:*
${address.street}

*Método de pago:* ${payment.method === 'efectivo' ? 'Efectivo' : payment.method === 'yappy' ? 'Yappy' : 'Transferencia'}

*Pedido:*
${itemsText}
-------------------
Subtotal: $${subtotal.toFixed(2)}
Envío: Por acordar
*Total: $${total.toFixed(2)}*`

        const whatsappUrl = whatsappLink(msg)
        window.open(whatsappUrl, '_blank')
        clearCart()
        setStep(4)
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(200,164,93,0.1)', border: '1px solid var(--gold)', borderRadius: 8, padding: 16, marginBottom: 4 }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
              <strong>Aviso Importante:</strong> Por el momento no contamos con pagos directos con tarjeta en la web. Al continuar, tu pedido será enviado a un <strong>asesor de ventas por WhatsApp</strong>, con quien podrás finalizar la compra de los productos seleccionados de forma segura.
            </p>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--fg)', marginBottom: 8 }}>Método de Pago Preferido</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            {[{ v: 'efectivo', l: 'Efectivo' }, { v: 'yappy', l: 'Yappy' }, { v: 'transfer', l: 'Transferencia' }].map(m => (
              <button key={m.v} onClick={() => setPayment({ method: m.v })}
                style={{ flex: 1, padding: '12px 8px', borderRadius: 8, border: `1.5px solid ${payment.method === m.v ? 'var(--gold)' : 'var(--border)'}`, background: payment.method === m.v ? 'rgba(200,164,93,0.08)' : 'transparent', color: payment.method === m.v ? 'var(--gold)' : 'var(--fg2)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}>
                {m.l}
              </button>
            ))}
          </div>
          {payment.method === 'yappy' && (
            <div style={{ padding: 24, background: 'var(--bg2)', borderRadius: 10, textAlign: 'center', color: 'var(--fg2)', fontSize: '0.9rem' }}>
              Al confirmar, te daremos nuestro número de Yappy por WhatsApp.
            </div>
          )}
          {payment.method === 'transfer' && (
            <div style={{ padding: 24, background: 'var(--bg2)', borderRadius: 10, textAlign: 'center', color: 'var(--fg2)', fontSize: '0.9rem' }}>
              Te enviaremos los datos de transferencia directamente a través de WhatsApp.
            </div>
          )}
          {payment.method === 'efectivo' && (
            <div style={{ padding: 24, background: 'var(--bg2)', borderRadius: 10, textAlign: 'center', color: 'var(--fg2)', fontSize: '0.9rem' }}>
              Pago en efectivo al momento de la entrega o retiro.
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1, padding: '14px 0', borderRadius: 8, cursor: 'pointer' }}>ATRÁS</button>
            <button onClick={handleConfirm} className="btn-gold" style={{ flex: 2, padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              CONTINUAR EN WHATSAPP
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108, background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,6vw,56px) clamp(20px,5vw,40px)' }}>
        <div className="checkout-steps" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, border: '2px solid', transition: 'all 0.3s', borderColor: step > i + 1 ? 'var(--gold)' : step === i + 1 ? 'var(--gold)' : 'var(--border)', background: step > i + 1 ? 'var(--gold)' : 'transparent', color: step > i + 1 ? '#111' : step === i + 1 ? 'var(--gold)' : 'var(--fg3)' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="step-label" style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: step === i + 1 ? 'var(--gold)' : 'var(--fg3)' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="step-line" style={{ width: 60, height: 1, background: step > i + 1 ? 'var(--gold)' : 'var(--border)', margin: '0 8px', marginBottom: 24, transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        <div className="r-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <div className="checkout-card" style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border)' }}>
            {renderStep()}
          </div>

          <div className="r-unstick" style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)', position: 'sticky', top: 100 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: 'var(--fg)', marginBottom: 16 }}>Resumen del Pedido</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 6, background: '#f0ede8' }} />
                    <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--gold)', color: '#111', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--fg3)' }}>{item.size}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)', flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--fg2)' }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--fg2)' }}>
                <span>Envío</span><span>Por acordar</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--fg)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(200,164,93,0.05)', borderRadius: 8, border: '1px dashed var(--gold)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gold)', margin: 0, lineHeight: 1.4 }}>
                  El pago no se procesará aquí. La transacción se completará de forma segura vía <strong>WhatsApp</strong> con un asesor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
