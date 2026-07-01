"use client";

import { useRef, useMemo, useEffect, useLayoutEffect as useIsomorphicLayoutEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { getMasterTimeline, LABELS } from '@/lib/animations';
import { useThree, useFrame } from '@react-three/fiber';

export const PILLAR_COUNT = 5;

export const ORDERED_HEIGHTS = [1.5, 2.5, 3.5, 4.5, 5.5];


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
  const lookAtProxy = useRef(new THREE.Vector3(0, 1.5, 0));

  // Sweep uniform: drives the white-from-bottom effect on both background and pillars
  const sweepProgress = useRef({ value: 0 }); // 0 = all dark, 1 = all white

  // Shared resolution for screen-space sweep
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const resY = useRef(typeof window !== 'undefined' ? window.innerHeight * dpr : 1000);

  // Background sweep plane material — uses screen-space coords to match pillars exactly
  const bgSweepMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSweep: { value: 0 },
        uResY: { value: resY.current },
        uColorDark: { value: new THREE.Color('#0A0A0B') },
        uColorLight: { value: new THREE.Color('#F5F4F0') },
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uSweep;
        uniform float uResY;
        uniform vec3 uColorDark;
        uniform vec3 uColorLight;
        void main() {
          // Screen-space Y normalized 0..1 (same as pillars)
          float screenY = gl_FragCoord.y / uResY;
          float edge = step(screenY, uSweep);
          // edge=1 below sweep (light), edge=0 above sweep (dark)
          vec3 color = mix(uColorDark, uColorLight, edge);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const tl = getMasterTimeline();
    if (!tl || !groupRef.current) return;

    const ctx = gsap.context(() => {
      // Position the pillars so their bases sit at the bottom of the screen
      gsap.set(groupRef.current.position, { x: 0, y: -6, z: 0 });
      gsap.set(groupRef.current.scale, { x: 1.4, y: 1.4, z: 1.4 });

      const reversedHeights = [...ORDERED_HEIGHTS].reverse();

      // Inject sweep shader into each pillar material
      meshesRef.current.forEach((mesh, i) => {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;

        // Initial state
        gsap.set(mat, { emissiveIntensity: i === 0 ? 0.15 : 0 });

        // Inject custom shader chunk to color-sweep the pillars
        if (!mat.userData.sweepInjected && i !== 0) {
          mat.userData.sweepInjected = true;
          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uSweep = sweepProgress.current;
            shader.uniforms.uResY = { value: resY.current };
            shader.fragmentShader = `
              uniform float uSweep;
              uniform float uResY;
              ${shader.fragmentShader}
            `.replace('#include <color_fragment>', `
              #include <color_fragment>
              // Screen-space Y: same coordinate system as background plane
              float screenY = gl_FragCoord.y / uResY;
              float sweepEdge = step(screenY, uSweep);
              // sweepEdge=1 below sweep (light), sweepEdge=0 above (keep original)
              vec3 sweepColor = vec3(0.85, 0.84, 0.82);
              diffuseColor.rgb = mix(diffuseColor.rgb, sweepColor, sweepEdge);
            `);
          };
          mat.needsUpdate = true;
        }

        // During Reframe: reverse heights
        tl.to(mesh.scale, { y: reversedHeights[i], duration: 0.5, ease: 'power2.inOut' }, LABELS.hero);
        tl.to(mesh.position, { y: reversedHeights[i] / 2, duration: 0.5, ease: 'power2.inOut' }, LABELS.hero);
      });

      // Animate the sweep upwards during the hero section
      tl.to(sweepProgress.current, {
        value: 1.2, // overshoot slightly to ensure full coverage
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          // Sync the background plane uniform with the same value
          bgSweepMaterial.uniforms.uSweep.value = sweepProgress.current.value;
        }
      }, LABELS.hero);

      // Shift the entire pillar group to the right to make room for text on the left, smoothly over hero scroll
      tl.to(groupRef.current.position, { x: 7.5, duration: 0.5, ease: 'power2.inOut' }, LABELS.hero);

      // --- PROBLEM TRANSITION ---
      // Shift group so the first pillar is centered (it's locally at -4.2)
      tl.to(groupRef.current.position, { x: 4.2, duration: 1, ease: 'power2.inOut' }, LABELS.problem);

      // Camera sweeps to look top-down at the first pillar
      // The first pillar top in world space: groupY + tallestHeight * groupScale = -6 + 5.5*1.4 = 1.7
      // Offset Z slightly by 0.01 to prevent gimbal lock / undefined up-vector snap
      const pillarTopWorld = -6 + ORDERED_HEIGHTS[PILLAR_COUNT - 1] * 1.4;
      tl.to(camera.position, { x: 0, y: pillarTopWorld + 10, z: 0.01, duration: 1, ease: 'power2.inOut' }, LABELS.problem);
      tl.to(lookAtProxy.current, { x: 0, y: pillarTopWorld, z: 0, duration: 1, ease: 'power2.inOut' }, LABELS.problem);

      // Make all other pillars fly out to the right side of the screen
      meshesRef.current.forEach((mesh, i) => {
        if (i !== 0) {
          // Add 20 units to their local X to shoot them offscreen
          tl.to(mesh.position, { x: getOrderedX(i) + 20, duration: 1, ease: 'power2.inOut' }, LABELS.problem);
        }
      });

      // Increase the size of the pillar a little bit while reaching top view so it's clearly visible
      tl.to(meshesRef.current[0].scale, { x: 2, z: 2, duration: 1, ease: 'power2.inOut' }, LABELS.problem);

      // Scale the first pillar massively to become the new background AFTER the camera is looking down.
      // We MUST scale Y to 0.01 (flatten it) so that perspective projection doesn't show the dark grey side faces,
      // which looks like a black background being pulled up.
      tl.to(meshesRef.current[0].scale, { x: 120, y: 0.01, z: 120, duration: 1, ease: 'power2.inOut' }, `${LABELS.problem}+=1`);

      // Hide the massive pillar at LABELS.vision so the background can return to black
      tl.to(meshesRef.current[0].material, { opacity: 0, transparent: true, duration: 1 }, LABELS.vision);

    });

    // Handle resize for the sweep shader
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      meshesRef.current.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mat.userData.sweepInjected) {
          mat.needsUpdate = true;
        }
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useFrame(() => {
    camera.lookAt(lookAtProxy.current);
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {Array.from({ length: PILLAR_COUNT }).map((_, i) => {

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
              emissiveIntensity: isInitialActive ? 0.15 : 0,
              transparent: true
            })}
            position={[getOrderedX(i), ORDERED_HEIGHTS[i] / 2, getOrderedZ(i)]}
            scale={[1, ORDERED_HEIGHTS[i], 1]}
            rotation={[0, Math.PI / 4, 0]}
          />
        );
      })}

      {/* Background sweep plane — sits behind the pillars */}
      <mesh position={[0, 0, -15]} scale={[200, 200, 1]} material={bgSweepMaterial}>
        <planeGeometry />
      </mesh>
    </group>
  );
}
