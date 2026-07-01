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
  const positionGroupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { scene } = useThree();

  const premiumEquatorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Base white (tinted by the material's color)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Sleek dark metallic band around the equator
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 490, 1024, 44);
    
    // Vibrant orange accent line in the very center
    ctx.fillStyle = '#E8622A';
    ctx.fillRect(0, 509, 1024, 6);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);



  useEffect(() => {
    if (!meshRef.current) return;

    scene.background = null; // Transparent to let HTML background show through
    
    // We no longer use bgProxy for the hero transition, we animate .bg-sweep directly.
    // We will still keep a bgProxy for the later transitions (vision) if needed, but since we are doing HTML backgrounds, we can animate document.body.

    const ctx = gsap.context(() => {
      const tl = getMasterTimeline();
      if (!tl) return;

      const posGroup = positionGroupRef.current!;
      const rotGroup = rotationGroupRef.current!;
      const mesh = meshRef.current!;
      const mat = materialRef.current!;

      const nodeRadius = 0.75;
      gsap.set(posGroup.scale, { x: nodeRadius, y: nodeRadius, z: nodeRadius });

      // The pillar group has position y=-6 and scale 1.4
      // So world position = groupY + localY * groupScale
      const groupY = -6;
      const groupScale = 1.4;
      
      // Spawn on the first pillar — nodeRadius is NOT scaled by groupScale since the sphere is outside the group
      const getPillarTopWorldY = (i: number) => groupY + ORDERED_HEIGHTS[i] * groupScale + nodeRadius;
      const getPillarWorldX = (i: number) => getOrderedX(i) * groupScale;

      gsap.set(posGroup.position, {
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
      tl.fromTo(posGroup.position, 
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
      tl.fromTo(posGroup.position, 
        { x: targetX, y: targetY, z: 0 },
        { x: 0, y: pillarTopWorld + nodeRadius, z: 0, duration: 1, ease: 'power2.inOut' }, 
        LABELS.problem
      );

      // 4. Solution section (bgCharcoal)
      // Delayed to 7.5 so the sphere stays perfectly in the center of the screen while the table scrolls!
      tl.fromTo(posGroup.position, 
        { x: 0, y: pillarTopWorld + nodeRadius, z: 0 },
        { x: 0, y: 2, z: 0, duration: 1 }, 
        7.5
      );

      // 4. Solution -> 5. How It Works (Path Travel) (bgCharcoal -> bgPaper)
      tl.fromTo(posGroup.position, 
        { x: 0, y: 2, z: 0 },
        { x: 0, y: 5, z: -5, duration: 0.5 }, 
        LABELS.howItWorks
      );

      // 5. How It Works -> 6. Vision (Multiply & Converge) (bgPaper -> bgVoid)
      tl.to(bgProxy, {
          color: TOKENS.bgVoid,
          duration: 1,
          onUpdate: () => {
            document.body.style.backgroundColor = bgProxy.color;
          }
        }, LABELS.vision)
        .fromTo(posGroup.position, { x: 0, y: 5, z: -5 }, { x: 0, y: 0, z: -10, duration: 1 }, LABELS.vision)
        .to(posGroup.scale, { x: 3, y: 3, z: 3, duration: 1 }, LABELS.vision)
        .to(mat, { emissiveIntensity: 1, duration: 0.5, yoyo: true, repeat: 1 }, `${LABELS.vision}+=0.2`)

      // 6. Vision -> 7. CTA (bgVoid)
      tl.fromTo(posGroup.position, { x: 0, y: 0, z: -10 }, { x: 0, y: 0, z: 0, duration: 1 }, LABELS.cta)
        .to(posGroup.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 }, LABELS.cta)
        .to(mat, { emissiveIntensity: 0.3, duration: 1 }, LABELS.cta)
        
      // CONTINUOUS SCROLL ROLLING:
      // Trigger strictly on the '#problem' section so it does NOT roll while resting on the pillar in sections 1 & 2!
      gsap.to(rotGroup.rotation, {
        x: Math.PI * 6, // Pure top-to-down roll precisely matching the section length
        ease: 'none',
        scrollTrigger: {
          trigger: '#problem',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    return () => {
      ctx.revert();
      scene.background = null;
    };
  }, [scene]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    // Removed idle rotation on Y axis so it doesn't spin "sideways" like a steering wheel when viewed from top-down
  });

  return (
    <group ref={positionGroupRef}>
      <group ref={rotationGroupRef}>
        {/* The Premium Metallic Sphere: 
            Restored the flawless glass sphere. We apply a sleek, procedural equatorial texture map 
            to explicitly show the top-to-down rotation without resorting to disco-ball facets! */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial
            ref={materialRef}
            map={premiumEquatorTexture}
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
      </group>
    </group>
  );
}
