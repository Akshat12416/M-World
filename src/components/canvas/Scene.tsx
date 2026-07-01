"use client";

import { useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Node from './Node';
import Lights from './Lights';
import HeroPillars from './HeroPillars';
import { resetMasterTimeline } from '@/lib/animations';

export default function Scene() {
  useEffect(() => {
    return () => resetMasterTimeline();
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 3.5, 13], fov: 55 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl, camera }) => {
        camera.lookAt(new THREE.Vector3(0, -0.5, 0));
        camera.updateProjectionMatrix();
        gl.setClearColor('#0A0A0B', 0); // MUST HAVE ALPHA 0 to allow HTML background sweep to show through
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Lights />
      <Environment preset="city" environmentIntensity={0.15} />
      <HeroPillars />
      <Node />
    </Canvas>
  );
}
