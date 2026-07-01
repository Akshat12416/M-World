export default function Header() {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.25rem 5%', 
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      background: 'transparent'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }} className="header-text">
        M-World
      </div>
      <nav style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', opacity: 0.8 }} className="hide-on-mobile header-text">
        <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>Platform</a>
        <a href="#solution" style={{ textDecoration: 'none', color: 'inherit' }}>Solutions</a>
        <a href="#vision" style={{ textDecoration: 'none', color: 'inherit' }}>Vision</a>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{ 
          background: 'var(--accent)', 
          color: 'var(--ink-primary)', 
          border: 'none', 
          padding: '0.6rem 1.25rem', 
          borderRadius: '2rem', 
          fontSize: '0.85rem', 
          fontWeight: 500, 
          cursor: 'pointer'
        }} className="cta-button">
          Request Access
        </button>
      </div>
    </header>
  );
}
