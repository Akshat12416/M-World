"use client";
export default function NodeFallback() {
  return (
    <div 
      className="node-fallback"
      style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, var(--accent-glow) 0%, rgba(216, 222, 232, 0.4) 40%, rgba(216, 222, 232, 0) 80%)',
        boxShadow: '0 0 20px rgba(216, 222, 232, 0.2)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5
      }}
    />
  );
}
