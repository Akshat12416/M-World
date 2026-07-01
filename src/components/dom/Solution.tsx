export default function Solution() {
  const departments = [
    "Research",
    "Marketing",
    "Sales",
    "Technology",
    "Finance",
    "Support",
    "Operations"
  ];

  return (
    <section id="solution" className="section bg-paper">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'flex-start' }}>
        <div style={{ position: 'sticky', top: '30vh' }} className="solution-copy">
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, color: 'var(--ink-dark)' }}>
            Instead of AI assisting employees, AI becomes the organization.
          </h2>
          <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: 'var(--ink-dark-muted)' }}>
            The Node coordinates work seamlessly across every function.
          </p>
          
          {/* Staggered Cards */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '3rem' }}>
            {["Task Execution", "Workflow Automation", "Resource Allocation", "Strategic Planning"].map((label, i) => (
              <div key={label} style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--line-light)',
                background: 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem',
                color: 'var(--ink-dark)',
                transform: `translateY(${i % 2 === 0 ? '0' : '1rem'})`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="solution-list" style={{ paddingBottom: '30vh' }}>
          {departments.map((dept, i) => (
            <div 
              key={dept} 
              className={`solution-row row-${i}`}
              style={{ 
                padding: '2rem 0', 
                borderBottom: '1px solid var(--line-light)',
                display: 'flex',
                alignItems: 'center',
                opacity: 0.3, // GSAP will animate this to 1 when active
                transition: 'opacity 0.4s ease'
              }}
            >
              {/* Space for the 3D Node to lock into (left side of the row) */}
              <div style={{ width: '80px', flexShrink: 0 }} className="node-anchor-point" />
              <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--ink-dark)' }}>{dept}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
