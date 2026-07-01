"use client";

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Environment } from '@react-three/drei';
import { getMasterTimeline, LABELS } from '@/lib/animations';
import { PILLAR_COUNT, getOrderedX, getOrderedZ, ORDERED_HEIGHTS } from './HeroPillars';

gsap.registerPlugin(ScrollTrigger);

// ... (skipping to inside ctx)
// Background color constants — must stay in sync with CSS custom properties
// --bg-void, --bg-charcoal, --bg-paper in globals.css
const TOKENS = {
  bgVoid: '#0A0A0B',
  bgCharcoal: '#161618',
  bgPaper: '#F5F4F2'
};

export default function Node() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { scene } = useThree();



  useEffect(() => {
    if (!meshRef.current) return;

    scene.background = null; // Transparent to let HTML background show through
    
    // We no longer use bgProxy for the hero transition, we animate .bg-sweep directly.
    // We will still keep a bgProxy for the later transitions (vision) if needed, but since we are doing HTML backgrounds, we can animate document.body.

    const ctx = gsap.context(() => {
      const tl = getMasterTimeline();
      if (!tl) return;

      const mesh = meshRef.current!;
      const mat = materialRef.current!;

      const nodeRadius = 0.75;
      gsap.set(mesh.scale, { x: nodeRadius, y: nodeRadius, z: nodeRadius });

      // The pillar group has position y=-6 and scale 1.4
      // So world position = groupY + localY * groupScale
      const groupY = -6;
      const groupScale = 1.4;
      
      // Spawn on the first pillar — nodeRadius is NOT scaled by groupScale since the sphere is outside the group
      const getPillarTopWorldY = (i: number) => groupY + ORDERED_HEIGHTS[i] * groupScale + nodeRadius;
      const getPillarWorldX = (i: number) => getOrderedX(i) * groupScale;

      gsap.set(mesh.position, {
        x: getPillarWorldX(0), 
        y: getPillarTopWorldY(0),
        z: 0
      });

      // 1. Hero scroll
      // Discarded old step-by-step pillar tracking animation
      // The sphere stays on the first pillar.

      // 2. Reframe -> 3. Problem (bgVoid -> bgPaper)
      // First pillar becomes the tallest. Node rides it up and shifts right with the group.
      // After reverse, pillar 0 gets the tallest height (ORDERED_HEIGHTS[PILLAR_COUNT-1])
      const tallestHeight = ORDERED_HEIGHTS[PILLAR_COUNT - 1];
      const targetY = groupY + tallestHeight * groupScale + nodeRadius;
      
      const initialX = getPillarWorldX(0);
      const targetX = initialX + 7.5; // Shift right by the same world-space amount as the pillar group
      
      // Animate the document body background for sections below the canvas
      const bgProxy = { color: TOKENS.bgVoid };
      tl.fromTo(mesh.position, 
          { x: initialX, y: getPillarTopWorldY(0), z: 0 },
          { x: targetX, y: targetY, z: 0, duration: 0.5, ease: 'power2.inOut' }, 
          LABELS.hero
        )
        .to(bgProxy, {
          color: TOKENS.bgPaper,
          duration: 0.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            document.body.style.backgroundColor = bgProxy.color;
          }
        }, LABELS.hero);

      // 3. Problem transition (Camera sweep to top-down)
      // The pillar group shifts so first pillar is centered. Its top in world space:
      // groupY + tallestHeight * groupScale = -6 + 7.5 * 1.4 = 4.5
      const pillarTopWorld = groupY + tallestHeight * groupScale;
      tl.to(mesh.position, { x: 0, y: pillarTopWorld + nodeRadius, z: 0, duration: 1, ease: 'power2.inOut' }, LABELS.problem);

      // ROLLING ANIMATION: As the table scrolls (time 4 to 7.5), the sphere physically rolls forward
      tl.to(mesh.rotation, { x: `+=${Math.PI * 6}`, duration: 3.5, ease: 'none' }, 4);

      // 4. Solution section (bgCharcoal)
      tl.to(mesh.position, { y: 2, duration: 1 }, LABELS.solution)

      // 4. Solution -> 5. How It Works (Path Travel) (bgCharcoal -> bgPaper)
      tl.to(mesh.position, { x: 0, y: 5, z: -5, duration: 0.5 }, LABELS.howItWorks)

      // 5. How It Works -> 6. Vision (Multiply & Converge) (bgPaper -> bgVoid)
      tl.to(bgProxy, {
          color: TOKENS.bgVoid,
          duration: 1,
          onUpdate: () => {
            document.body.style.backgroundColor = bgProxy.color;
          }
        }, LABELS.vision)
        .to(mesh.position, { x: 0, y: 0, z: -10, duration: 1 }, LABELS.vision)
        .to(mesh.scale, { x: 3, y: 3, z: 3, duration: 1 }, LABELS.vision)
        .to(mat, { emissiveIntensity: 1, duration: 0.5, yoyo: true, repeat: 1 }, `${LABELS.vision}+=0.2`)

      // 6. Vision -> 7. CTA (bgVoid)
      tl.to(mesh.position, { x: 0, y: 0, z: 0, duration: 1 }, LABELS.cta)
        .to(mesh.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 }, LABELS.cta)
        .to(mat, { emissiveIntensity: 0.3, duration: 1 }, LABELS.cta)
    });

    return () => {
      ctx.revert();
      scene.background = null;
    };
  }, [scene]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.2;
    // We removed rotation.x from the idle animation so GSAP can exclusively control the X-axis for the scrolling "roll" effect
  });

  return (
    <>
      <mesh ref={meshRef} position={[-4.515, -1.66, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#D8D4CC"
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.08}
          metalness={0.95}
          transmission={0.9}
          thickness={1.5}
          clearcoat={0.1}
        />
      </mesh>
    </>
  );
}
