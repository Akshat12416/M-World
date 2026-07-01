export default function Reframe() {
  return (
    <section id="reframe" className="section bg-paper" style={{ marginTop: '-150vh', pointerEvents: 'none' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', minHeight: '100vh', paddingLeft: '5%', pointerEvents: 'auto' }}>
        <div className="reframe-content" style={{ maxWidth: '550px', opacity: 0, marginTop: '8rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '1.5rem', color: '#111113' }}>
            <span style={{ whiteSpace: 'nowrap' }}>This is not another AI tool.</span><br/>
            This is a new way to build and operate businesses.
          </h2>
          <div style={{ maxWidth: '450px' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.5, color: '#111113' }}>
              At M-World, we are committed to providing autonomous solutions that help you achieve operational freedom. Our intelligent agents are designed to seamlessly integrate and drive your business forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
