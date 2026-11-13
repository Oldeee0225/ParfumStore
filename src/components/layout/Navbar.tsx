import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@/providers/ThemeProvider'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import logo from '@/assets/Logo.jpeg'
import { SearchOverlay } from '@/components/layout/SearchOverlay'

const NAV_LINKS = [
  { label: 'Tienda', path: '/tienda', sub: ['Diseñador', 'Nicho', 'Árabes', 'Decants', 'Hombre', 'Mujer', 'Unisex'] },
  { label: 'Decants', path: '/decants', sub: ['5 ml', '10 ml', 'Discovery Sets', 'Viaje'] },
  { label: 'Marcas', path: '/marcas', sub: [] },
  { label: 'Nosotros', path: '/nosotros', sub: [] },
  { label: 'Notas', path: '/notas', sub: [] },
  { label: '📋 WorkList', path: '/worklist', sub: [] },
]

export function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { darkMode, toggleDark } = useTheme()
  const { cartCount, toggleCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Atajos: ⌘K / Ctrl+K desde cualquier lugar, "/" cuando no se está escribiendo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName))
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
      else if (e.key === '/' && !typing) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navBg = scrolled ? 'rgba(255,255,255,0.97)' : (darkMode ? 'rgba(17,17,17,0.97)' : 'rgba(255,255,255,0.97)')

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: darkMode ? 'rgba(17,17,17,0.97)' : navBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`, transition: 'all 0.3s ease' }}>
      <div style={{ background: 'var(--gold)', textAlign: 'center', padding: '6px 0', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', color: '#111' }}>
        ✦ AUTENTICIDAD GARANTIZADA ✦
      </div>

      <div className="nav-row" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 68, gap: 32 }}>
        <button onClick={() => { navigate('/'); setMobileOpen(false) }} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, padding: 0 }}>
          <img src={logo} alt="Elegant Parfum Pty" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold)', flexShrink: 0 }} />
          <span className="nav-brand-text" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--fg)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Elegant Parfum Pty</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }} className="hidden md:flex">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.path
            return (
              <div key={link.path} style={{ position: 'relative' }}
                onMouseEnter={() => link.sub.length > 0 && setMegaMenu(link.path)}
                onMouseLeave={() => setMegaMenu(null)}>
                <button onClick={() => navigate(link.path)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.04em', color: isActive ? 'var(--gold)' : 'var(--fg)', transition: 'color 0.2s', borderBottom: isActive ? '1.5px solid var(--gold)' : '1.5px solid transparent' }}>
                  {link.label}
                </button>
                {megaMenu === link.path && link.sub.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: '16px 20px', minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {link.sub.map(s => {
                      let targetUrl = link.path;
                      if (link.path === '/tienda') {
                        if (s === 'Diseñador') targetUrl = '/tienda?categoria=designer';
                        if (s === 'Nicho') targetUrl = '/tienda?categoria=niche';
                        if (s === 'Árabes') targetUrl = '/tienda?categoria=arabic';
                        if (s === 'Hombre') targetUrl = '/tienda?genero=men';
                        if (s === 'Mujer') targetUrl = '/tienda?genero=women';
                        if (s === 'Unisex') targetUrl = '/tienda?genero=unisex';
                      }
                      return (
                        <button key={s} onClick={() => { navigate(targetUrl); setMegaMenu(null) }}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '7px 0', fontSize: '0.82rem', color: 'var(--fg2)', textAlign: 'left', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg2)')}>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 'auto' }}>
          <button onClick={() => { setSearchOpen(true); setMobileOpen(false) }} aria-label="Buscar (⌘K)" title="Buscar (⌘K)"
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--fg)', padding: 4, opacity: 0.7, transition: 'opacity 0.2s', display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

          <button onClick={toggleDark} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--fg)', padding: 4, opacity: 0.7, transition: 'opacity 0.2s', display: 'flex' }}>
            {darkMode ? (
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button onClick={toggleWishlist} style={{ border: 'none', background: 'none', cursor: 'pointer', position: 'relative', padding: 4, fontSize: 18, color: 'var(--fg)', opacity: 0.7, display: 'flex' }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--gold)', color: '#111', borderRadius: '50%', fontSize: '0.6rem', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{wishlist.length}</span>}
          </button>

          <button onClick={toggleCart} style={{ border: 'none', background: 'none', cursor: 'pointer', position: 'relative', padding: 4, fontSize: 18, color: 'var(--fg)', opacity: 0.7 }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--gold)', color: '#111', borderRadius: '50%', fontSize: '0.6rem', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>}
          </button>

          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--fg)', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

        </div>
      </div>

      {mobileOpen && (
        <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '8px 20px 16px', maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}>
          {NAV_LINKS.map(link => (
            <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false) }}
              style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: '12px 0', fontSize: '0.9rem', color: pathname === link.path ? 'var(--gold)' : 'var(--fg)', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
