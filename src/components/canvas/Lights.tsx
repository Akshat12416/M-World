"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Soft key light from top right */}
      <directionalLight position={[8, 10, 5]} intensity={1.5} color="#ffffff" />
      {/* Fill light from bottom left */}
      <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#D8DEE8" />
      {/* Warm orange point light hitting the node for a premium warm metallic reflection */}
      <pointLight position={[2, 0, 4]} intensity={0.7} color="#E8622A" distance={20} />
    </>
  );
}
