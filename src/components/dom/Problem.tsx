export default function Problem() {
  const departments = [
    { name: "Research", desc: "Automate data gathering and insights generation." },
    { name: "Marketing", desc: "Coordinate campaigns and content creation autonomously." },
    { name: "Sales", desc: "Qualify leads and drive outreach at scale." },
    { name: "Technology", desc: "Maintain infrastructure and deploy code continuously." }
  ];

  return (
    <section id="problem" className="section bg-paper" style={{ position: 'relative', height: '150vh', pointerEvents: 'none' }}>
      <div className="container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', pointerEvents: 'none', justifyContent: 'center', paddingTop: '10vh' }}>
        
        {/* Top Text */}
        <div className="problem-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pointerEvents: 'auto' }}>
          <div style={{ fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '0.5rem 1rem', display: 'inline-block', color: 'var(--ink-primary)', marginBottom: '1.5rem' }}>
            The Node
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, color: 'var(--ink-primary)', maxWidth: '800px', margin: '0 auto' }}>
            Instead of AI assisting employees,<br/>AI becomes the organization.
          </h2>
        </div>
        
        {/* Gap for the sphere which will be centered */}
        <div style={{ flex: 1, minHeight: '20vh' }}></div>

        {/* Bottom List */}
        <div className="problem-list" style={{ width: '100%', maxWidth: '900px', paddingBottom: '10vh' }}>
          {departments.map((dept, i) => (
            <div 
              key={dept.name} 
              className={`problem-row`}
              style={{ 
                padding: '1.5rem 0', 
                borderTop: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--ink-primary)',
                pointerEvents: 'auto',
                transform: 'translateY(20px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>(0{i+1})</span>
                <h3 style={{ fontSize: '1.5rem', margin: 0, width: '150px' }}>{dept.name}</h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '1rem', flex: 1 }}>{dept.desc}</p>
              </div>
              <button style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '30px', 
                border: '1px solid rgba(255,255,255,0.4)', 
                background: 'transparent',
                color: 'var(--ink-primary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background 0.2s'
              }}>
                Learn More
              </button>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
