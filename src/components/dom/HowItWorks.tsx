export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-void" style={{ minHeight: '200vh' }}>
      <div className="container" style={{ position: 'sticky', top: '20vh', height: '60vh' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center', marginBottom: '4rem' }}>
          Continuous Execution
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5%' }}>
          <div className="step step-1" style={{ width: '25%', opacity: 0.3 }}>
            <h4 style={{ color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Step 01</h4>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Deploy the organization</h3>
          </div>
          
          <div className="step step-2" style={{ width: '25%', opacity: 0.3 }}>
            <h4 style={{ color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Step 02</h4>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Departments coordinate autonomously</h3>
          </div>
          
          <div className="step step-3" style={{ width: '25%', opacity: 0.3 }}>
            <h4 style={{ color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Step 03</h4>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Work executes continuously</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
