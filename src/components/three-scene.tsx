'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    // Globe
    const globeGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: theme === 'dark' ? 0x444444 : 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Glowing dots
    const dotCount = 300;
    const dotVertices = [];
    for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotCount);
        const theta = Math.sqrt(dotCount * Math.PI) * phi;

        const x = 2.3 * Math.cos(theta) * Math.sin(phi);
        const y = 2.3 * Math.sin(theta) * Math.sin(phi);
        const z = 2.3 * Math.cos(phi);
        
        dotVertices.push(x, y, z);
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotVertices, 3));
    
    const dotMaterial = new THREE.PointsMaterial({
        color: 0x00aaff,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dots);


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00aaff, 70);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 30);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      globe.rotation.y = elapsedTime * 0.1;
      dots.rotation.y = elapsedTime * 0.1;

      // Make it react to mouse movement
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentMount) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update material color when theme changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
      
    const globe = scene.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial> | undefined;
    if (globe) {
      globe.material.color.set(theme === 'dark' ? 0x444444 : 0xcccccc);
    }
     const dots = scene.children.find(child => child instanceof THREE.Points) as THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | undefined;
    if(dots){
        dots.material.color.set(theme === 'dark' ? 0x00aaff : 0x0055aa);
    }
  }, [theme]);


  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full opacity-50" />;
};

export default ThreeScene;
