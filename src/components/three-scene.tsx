'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const scrollYRef = useRef(0);

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
      color: 0x87cefa,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;

    // Earth-like points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 4000;
    const posArray = new Float32Array(pointsCount * 3);
    const r = 2.5;

    for (let i = 0; i < pointsCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      posArray[i * 3 + 0] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }


    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.035,
        color: 0xadd8e6,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
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
        size: 0.035,
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.95
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xB19CD9, 1);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x6A478F, 1);
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

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      const scrollY = scrollYRef.current;
      const scrollThreshold = window.innerHeight; // Zoom only on first page
      const scrollOffset = Math.min(scrollY, scrollThreshold) * 0.001;

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
        cameraRef.current.position.z = 5 - scrollOffset;
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObject(globeRef.current);
        
        if (intersects.length > 0) {
            if (!isHovering) setIsHovering(true);
        } else {
            if (isHovering) setIsHovering(false);
        }
      }

      renderer.render(scene, cameraRef.current!);
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
      window.removeEventListener('scroll', handleScroll);
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
        (globe.material as THREE.MeshPhongMaterial).color.set(0xADD8E6);
      } else {
        (globe.material as THREE.MeshPhongMaterial).color.set(0x87cefa);
      }
    }
  }, [isHovering]);


  return <div ref={mountRef} className="fixed inset-0 z-0 h-full w-full opacity-70" />;
};

export default ThreeScene;
