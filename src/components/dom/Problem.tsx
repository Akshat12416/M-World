export default function Problem() {
  return (
    <section id="problem" className="section bg-paper" style={{ marginTop: '-150vh', pointerEvents: 'none', height: '150vh' }}>
      <div className="container" style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', pointerEvents: 'auto', justifyContent: 'center' }}>
        <div className="problem-content" style={{ opacity: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', textAlign: 'center', marginBottom: '4rem', maxWidth: '800px' }} className="problem-text">
            Organizations today are fragmented. Departments operate in silos, connected only by slow, lossy human coordination.
          </h2>
        
        {/* Static SVG Diagram representing fragmentation */}
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="problem-diagram">
          <circle cx="150" cy="150" r="4" fill="var(--ink-secondary)" />
          
          <circle cx="50" cy="100" r="8" fill="var(--bg-charcoal)" stroke="var(--ink-secondary)" strokeWidth="2" />
          <line x1="50" y1="100" x2="150" y2="150" stroke="var(--line-dark)" strokeDasharray="4 4" />
          
          <circle cx="250" cy="80" r="8" fill="var(--bg-charcoal)" stroke="var(--ink-secondary)" strokeWidth="2" />
          <line x1="250" y1="80" x2="150" y2="150" stroke="var(--line-dark)" strokeDasharray="4 4" />
          
          <circle cx="200" cy="250" r="8" fill="var(--bg-charcoal)" stroke="var(--ink-secondary)" strokeWidth="2" />
          <line x1="200" y1="250" x2="150" y2="150" stroke="var(--line-dark)" strokeDasharray="4 4" />
          
          <circle cx="80" cy="220" r="8" fill="var(--bg-charcoal)" stroke="var(--ink-secondary)" strokeWidth="2" />
          <line x1="80" y1="220" x2="150" y2="150" stroke="var(--line-dark)" strokeDasharray="4 4" />
        </svg>
        </div>
      </div>
    </section>
  );
}
