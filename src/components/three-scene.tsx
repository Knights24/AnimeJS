'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Globe
    const globeGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: theme === 'dark' ? 0x444444 : 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;

    // Glowing points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 2000;
    const posArray = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount * 3; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2.5;
        posArray[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i*3+2] = r * Math.cos(phi);
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: theme === 'dark' ? 0x00aaff : 0x0055aa,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
    pointsRef.current = points;

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const starPosArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPosArray[i*3+0] = (Math.random() - 0.5) * 20;
        starPosArray[i*3+1] = (Math.random() - 0.5) * 20;
        starPosArray[i*3+2] = (Math.random() - 0.5) * 20;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPosArray, 3));
    const starMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: theme === 'dark' ? 0xaaaaaa : 0x555555,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00aaff, 1);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffaa00, 1);
    pointLight2.position.set(-5, -3, -5);
    scene.add(pointLight2);
    
    const clock = new THREE.Clock();
    
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      if(globeRef.current){
        globeRef.current.rotation.y = elapsedTime * 0.1;
      }
      if(pointsRef.current){
        pointsRef.current.rotation.y = elapsedTime * 0.1;
      }
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsedTime * 0.02;
      }
     
      if (cameraRef.current && globeRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObject(globeRef.current);
        
        if (intersects.length > 0) {
            if (!isHovering) setIsHovering(true);
        } else {
            if (isHovering) setIsHovering(false);
        }
      }

      renderer.render(scene, cameraRef.current);
    };
    animate();

    const handleResize = () => {
      if (currentMount && renderer && cameraRef.current) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update material color when theme changes or on hover
  useEffect(() => {
    const globe = globeRef.current;
    if (globe) {
      if(isHovering) {
        (globe.material as THREE.MeshPhongMaterial).color.set(theme === 'dark' ? 0x00aaff : 0x0055aa);
      } else {
        (globe.material as THREE.MeshPhongMaterial).color.set(theme === 'dark' ? 0x444444 : 0xcccccc);
      }
    }
    const points = pointsRef.current;
    if (points) {
      (points.material as THREE.PointsMaterial).color.set(theme === 'dark' ? 0x00aaff : 0x0055aa);
    }
    const stars = starsRef.current;
    if (stars) {
      (stars.material as THREE.PointsMaterial).color.set(theme === 'dark' ? 0xaaaaaa : 0x555555);
    }
  }, [theme, isHovering]);


  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full opacity-50" />;
};

export default ThreeScene;
