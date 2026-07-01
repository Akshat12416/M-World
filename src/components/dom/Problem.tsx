export default function Problem() {
  const departments = [
    { name: "Research", desc: "Automate comprehensive data gathering, market analysis, and insights generation without human intervention." },
    { name: "Marketing", desc: "Coordinate omni-channel campaigns, optimize ad spend, and generate personalized content autonomously." },
    { name: "Sales", desc: "Qualify inbound leads, drive outbound outreach at scale, and negotiate complex contracts around the clock." },
    { name: "Operations", desc: "Manage global supply chains, optimize resource allocation, and streamline daily workflows with predictive AI." },
    { name: "Finance", desc: "Handle automated bookkeeping, generate real-time financial models, and execute programmatic asset trading." },
    { name: "Technology", desc: "Maintain cloud infrastructure, monitor system health, and deploy code continuously with self-healing capabilities." }
  ];

  return (
    <section id="problem" className="section bg-paper" style={{ position: 'relative', height: '150vh', pointerEvents: 'none', overflowX: 'hidden' }}>
      {/* We remove the .container class to prevent max-width and padding constraints from clipping the full-width rows */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
        
        <div className="problem-scroll-wrapper" style={{ width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '12vh' }}>
          {/* Top Text */}
          <div className="problem-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pointerEvents: 'auto' }}>
            <div style={{ fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '0.5rem 1rem', display: 'inline-block', color: 'var(--ink-primary)', marginBottom: '1.5rem' }}>
              The Node
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, color: 'var(--ink-primary)', maxWidth: '800px', margin: '0 auto' }}>
              Instead of AI assisting employees,<br/>AI becomes the organization.
            </h2>
          </div>
          
          {/* Gap for the sphere to rest before scrolling begins */}
          <div style={{ height: '30vh' }}></div>

          {/* Bottom List (Table) */}
          <div className="problem-list" style={{ width: '100vw', paddingBottom: '20vh' }}>
            {departments.map((dept, i) => (
              <div 
                key={dept.name} 
                className={`problem-row problem-row-${i}`}
                style={{ 
                  width: '100%',
                  padding: '2.5rem 10vw', 
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  borderBottom: i === departments.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--ink-primary)',
                  pointerEvents: 'auto',
                  background: 'transparent',
                }}
              >
                {/* Left Side: Number and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flex: 1 }}>
                  <span style={{ fontSize: '1rem', opacity: 0.6, width: '40px' }}>(0{i+1})</span>
                  <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 500 }}>{dept.name}</h3>
                </div>

                {/* Center Spacer: Guarantees a wide open channel for the 3D sphere to roll through */}
                <div style={{ width: '150px', flexShrink: 0 }}></div>

                {/* Right Side: Description and Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flex: 1, justifyContent: 'flex-end' }}>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '1rem', maxWidth: '400px', lineHeight: 1.6 }}>{dept.desc}</p>
                  <button className="problem-btn" style={{ 
                    padding: '0.8rem 2rem', 
                    borderRadius: '30px', 
                    border: '1px solid rgba(255,255,255,0.4)', 
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                  }}>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
