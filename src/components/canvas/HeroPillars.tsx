"use client";

import { useRef, useMemo, useEffect, useLayoutEffect as useIsomorphicLayoutEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import { Search, Megaphone, DollarSign, Cpu, LifeBuoy, Settings } from 'lucide-react';
import { getMasterTimeline, LABELS } from '@/lib/animations';
import { useThree, useFrame } from '@react-three/fiber';

export const PILLAR_COUNT = 5;
const ICONS = [Search, Megaphone, DollarSign, Cpu];

export const ORDERED_HEIGHTS = [2.5, 3.5, 4.5, 5.5, 6.5];


export const getOrderedX = (index: number) => {
  // Total span is 4 * 2.1 = 8.4. Center starts at -4.2 to perfectly center the group.
  return -4.2 + index * 2.1;
};

export const getOrderedZ = (index: number) => {
  return 0;
};

// Set width/depth to 1.5 but keep height at 1.0 so vertical scaling works accurately
const geometry = new THREE.BoxGeometry(1.5, 1.0, 1.5);

export default function HeroPillars() {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const { camera, size } = useThree();
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const sweepUniforms = useRef({
    sweepY: { value: -0.1 },
    resolutionY: { value: typeof window !== 'undefined' ? window.innerHeight * (window.devicePixelRatio || 1) : 1000 }
  });

  const bgMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ color: "#0A0A0B" });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.sweepY = sweepUniforms.current.sweepY;
      shader.uniforms.resolutionY = sweepUniforms.current.resolutionY;
      shader.fragmentShader = `
        uniform float sweepY;
        uniform float resolutionY;
        ${shader.fragmentShader}
      `.replace('#include <color_fragment>', `
        #include <color_fragment>
        float screenY = gl_FragCoord.y / resolutionY;
        float mixFactor = step(sweepY, screenY);
        vec3 premiumWhite = vec3(0.96, 0.95, 0.95);
        
        diffuseColor.rgb = mix(premiumWhite, diffuseColor.rgb, mixFactor);
      `);
    };
    return mat;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const tl = getMasterTimeline();
    if (!tl || !groupRef.current) return;

    const ctx = gsap.context(() => {
      // Position the pillars to touch the bottom of the screen (Y ≈ -9.3 based on camera projection)
      gsap.set(groupRef.current.position, { x: 0, y: -9.5, z: 0 });
      gsap.set(groupRef.current.scale, { x: 1.4, y: 1.4, z: 1.4 });

      const reversedHeights = [...ORDERED_HEIGHTS].reverse();

      const handleResize = () => { sweepUniforms.current.resolutionY.value = window.innerHeight * (window.devicePixelRatio || 1); };
      window.addEventListener('resize', handleResize);

      meshesRef.current.forEach((mesh, i) => {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;

        // Initial state
        gsap.set(mat, { emissiveIntensity: i === 0 ? 0.15 : 0 });

        // Apply custom shader for color sweep
        if (!mat.userData.shaderInjected && i !== 0) {
          mat.userData.shaderInjected = true;
          mat.onBeforeCompile = (shader) => {
            shader.uniforms.sweepY = sweepUniforms.current.sweepY;
            shader.uniforms.resolutionY = sweepUniforms.current.resolutionY;
            shader.fragmentShader = `
              uniform float sweepY;
              uniform float resolutionY;
              ${shader.fragmentShader}
            `.replace('#include <color_fragment>', `
              #include <color_fragment>
              float screenY = gl_FragCoord.y / resolutionY;
              float mixFactor = step(sweepY, screenY);
              vec3 targetColor = vec3(0.96, 0.95, 0.95);
              diffuseColor.rgb = mix(targetColor, diffuseColor.rgb, mixFactor);
            `);
          };
          mat.needsUpdate = true;
        }

        // During Reframe: reverse heights
        const newHeight = reversedHeights[i];
        tl.to(mesh.scale, { y: newHeight, duration: 1, ease: 'power2.inOut' }, LABELS.hero);
        tl.to(mesh.position, { y: newHeight / 2, duration: 1, ease: 'power2.inOut' }, LABELS.hero);
      });

      // Animate the sweep uniformly for all pillars
      tl.to(sweepUniforms.current.sweepY, { value: 1.2, duration: 1, ease: 'power2.inOut' }, LABELS.hero);

      // Shift the entire pillar group to the right to make room for text on the left
      tl.to(groupRef.current.position, { x: 7.5, duration: 1, ease: 'power2.inOut' }, LABELS.hero);

    });

    return () => ctx.revert();
  }, []);


  useFrame(() => {
    labelsRef.current.forEach((el, i) => {
      if (!el || !groupRef.current) return;

      const topCenter = new THREE.Vector3(
        getOrderedX(i),
        (ORDERED_HEIGHTS[i] / 2) + (ORDERED_HEIGHTS[i] / 2), // position.y + height/2 = height
        getOrderedZ(i)
      );

      // Convert to world space
      topCenter.applyMatrix4(groupRef.current.matrixWorld);
      topCenter.project(camera);

      const screenX = (topCenter.x + 1) / 2 * size.width;
      const screenY = (-topCenter.y + 1) / 2 * size.height;

      el.style.left = `${screenX}px`;
      el.style.top = `${screenY}px`;
    });
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {Array.from({ length: PILLAR_COUNT }).map((_, i) => {
        const Icon = ICONS[i];
        const isInitialActive = i === 0;
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) meshesRef.current[i] = el; }}
            geometry={geometry}
            material={new THREE.MeshPhysicalMaterial({
              color: isInitialActive ? '#E8622A' : '#2A2A2E',
              metalness: 0.8,
              roughness: 0.2,
              emissive: isInitialActive ? '#E8622A' : '#000000',
              emissiveIntensity: isInitialActive ? 0.15 : 0
            })}
            position={[getOrderedX(i), ORDERED_HEIGHTS[i] / 2, getOrderedZ(i)]}
            scale={[1, ORDERED_HEIGHTS[i], 1]}
            rotation={[0, Math.PI / 4, 0]}
          />
        );
      })}

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {Array.from({ length: PILLAR_COUNT }).map((_, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={`label-${i}`}
              ref={(el) => { labelsRef.current[i] = el; }}
              style={{
                position: 'absolute',
                background: '#1C1C1E',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#F0EDE8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                width: 'max-content',
                minWidth: '90px',
                transform: 'translate(-50%, -100%)', // Centered horizontally, bottom at anchor
                opacity: i === 0 ? 0 : 1 // Hide first label like Credify
              }}
            >
              <Icon size={14} style={{ color: 'inherit', marginBottom: '2px' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1.1, textAlign: 'center' }}>

              </span>
            </div>
          );
        })}
      </Html>

      {/* WebGL Background Sweep Plane */}
      <mesh position={[0, 0, -20]} scale={[100, 100, 1]} material={bgMaterial}>
        <planeGeometry />
      </mesh>
    </group>
  );
}
