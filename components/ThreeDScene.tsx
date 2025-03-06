"use client"

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BufferGeometry, BufferAttribute, MeshNormalMaterial } from 'three';
import { useTheme } from 'next-themes';

const ThreeDScene: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const { theme } = useTheme();

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const vertices = [];
    const size = 2;

    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * size - size / 2;
      const y = Math.random() * size - size / 2;
      const z = Math.random() * size - size / 2;
      vertices.push(x, y, z);
    }

    geo.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef} geometry={geometry}>
        <meshNormalMaterial />
      </mesh>
    </>
  );
};

export default ThreeDScene;