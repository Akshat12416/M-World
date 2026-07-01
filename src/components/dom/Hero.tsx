"use client";

export default function Hero() {
  return (
    <section id="hero" className="bg-void" style={{ position: 'relative', height: '150vh' }}>

      {/* Sticky viewport container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>

        <div className="container hero-content-wrapper" style={{ textAlign: 'center', marginTop: '12vh', position: 'relative', zIndex: 10 }}>
          <h1
            className="hero-title"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0 auto',
              maxWidth: '800px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 500
            }}
          >
            The Operating System for Autonomous Organizations
          </h1>
          <p
            className="hero-subtitle"
            style={{ marginTop: '1.25rem', fontSize: '1.1rem', color: 'var(--ink-secondary)', fontWeight: 400 }}
          >
            Intelligent agents coordinating seamlessly to drive your business forward.
          </p>

        </div>

        {/* Scroll Down Cue */}
        <div className="scroll-cue" style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-secondary)' }}>

          </span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--ink-secondary), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
