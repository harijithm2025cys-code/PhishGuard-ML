import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Cyber Globe Component
 * Renders an interactive, rotating cybersecurity network sphere
 * with nodes, connecting latitude/longitude wireframe, floating particles,
 * and dynamic scanning rings.
 */
export default function CyberGlobe({ isScanning, riskLevel }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 300;
    const height = currentMount.clientHeight || 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Color theme based on risk level
    let primaryColor = 0x06b6d4; // Cyan default
    let accentColor = 0x38bdf8;  // Light blue default

    if (riskLevel === 'HIGH') {
      primaryColor = 0xef4444; // Red
      accentColor = 0xf87171;
    } else if (riskLevel === 'MEDIUM') {
      primaryColor = 0xf59e0b; // Amber
      accentColor = 0xfbbf24;
    } else if (riskLevel === 'LOW') {
      primaryColor = 0x10b981; // Green
      accentColor = 0x34d399;
    }

    // 2. Inner Glowing Wireframe Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.8, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: isScanning ? 0.35 : 0.18,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(globeMesh);

    // 3. Network Nodes (Points on Sphere Vertices)
    const pointsMat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
    });
    const nodes = new THREE.Points(sphereGeo, pointsMat);
    globeMesh.add(nodes);

    // 4. Scanning Rings
    const ringGeo = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isScanning ? 0x00f0ff : accentColor,
      transparent: true,
      opacity: isScanning ? 0.8 : 0.25,
    });
    const scanRing = new THREE.Mesh(ringGeo, ringMat);
    scanRing.rotation.x = Math.PI / 2.2;
    scene.add(scanRing);

    const ringGeo2 = new THREE.TorusGeometry(2.1, 0.008, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.2,
    });
    const secondaryRing = new THREE.Mesh(ringGeo2, ringMat2);
    secondaryRing.rotation.x = Math.PI / 4;
    secondaryRing.rotation.y = Math.PI / 6;
    scene.add(secondaryRing);

    // 5. Floating Cloud Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const speedMultiplier = isScanning ? 2.8 : 1.0;

      // Rotate globe
      globeMesh.rotation.y += 0.004 * speedMultiplier;
      globeMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15;

      // Animate scan rings
      scanRing.rotation.z += 0.015 * speedMultiplier;
      secondaryRing.rotation.y -= 0.008 * speedMultiplier;

      // Gently rotate particle cloud
      particles.rotation.y += 0.001 * speedMultiplier;
      particles.rotation.x += 0.0005 * speedMultiplier;

      if (isScanning) {
        const pulse = (Math.sin(elapsedTime * 6) + 1) / 2;
        ringMat.opacity = 0.5 + pulse * 0.5;
        sphereMat.opacity = 0.25 + pulse * 0.25;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [isScanning, riskLevel]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" />
      
      {/* Scanning status banner overlay on 3D globe */}
      {isScanning && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 backdrop-blur-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono tracking-wider text-cyan-200 uppercase font-semibold">
            Scanning Active
          </span>
        </div>
      )}
    </div>
  );
}
