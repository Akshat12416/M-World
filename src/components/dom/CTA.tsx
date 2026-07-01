export default function CTA() {
  return (
    <section id="cta" className="section bg-void" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
        {/* Node will resolve exactly into the center of this button */}
        <button 
          className="cta-button"
          style={{ 
            padding: '1rem 2.5rem', 
            fontSize: '1.25rem', 
            borderRadius: '100px', 
            background: 'var(--accent)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          Request Early Access
        </button>
      </div>
    </section>
  );
}
