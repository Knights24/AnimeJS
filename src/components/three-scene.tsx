'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

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
    
    const globeGeometry = new THREE.SphereGeometry(2.2, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: theme === 'dark' ? 0x444444 : 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        if(new THREE.Vector3(x,y,z).length() > 200) starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0x888888,
        size: 0.1,
        transparent: true
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    particlesRef.current = stars;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00aaff, 70);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 30);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    const handleClick = () => {
        if (!camera || !globe) return;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(globe);

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            createRipple(intersectionPoint);
        }
    }
    
    const createRipple = (position: THREE.Vector3) => {
        const rippleGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 100);
        const rippleMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide, transparent: true });
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        
        ripple.position.copy(position);
        ripple.lookAt(new THREE.Vector3(0,0,0));
        scene.add(ripple);

        let scale = 1;
        let opacity = 1;
        const animateRipple = () => {
            scale += 0.1;
            opacity -= 0.025;
            ripple.scale.set(scale, scale, scale);
            ripple.material.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateRipple);
            } else {
                scene.remove(ripple);
                rippleGeometry.dispose();
                rippleMaterial.dispose();
            }
        };
        animateRipple();
    }


    document.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('click', handleClick);
    
    const clock = new THREE.Clock();
    let isHovering = false;
    
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      if(globe){
        globe.rotation.y = elapsedTime * 0.1;
      }
      if(stars){
        stars.rotation.y = elapsedTime * 0.02;
      }
     
      if (camera && globe) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(globe);
        
        if (intersects.length > 0) {
            if (!isHovering) {
                isHovering = true;
                (globe.material as THREE.MeshPhongMaterial).color.set(theme === 'dark' ? 0x00aaff : 0x0055aa);
            }
        } else {
            if (isHovering) {
                isHovering = false;
                (globe.material as THREE.MeshPhongMaterial).color.set(theme === 'dark' ? 0x444444 : 0xcccccc);
            }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentMount && renderer && camera) {
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
        currentMount.removeEventListener('click', handleClick);
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update material color when theme changes
  useEffect(() => {
    const globe = globeRef.current;
    if (globe) {
      (globe.material as THREE.MeshPhongMaterial).color.set(theme === 'dark' ? 0x444444 : 0xcccccc);
    }
  }, [theme]);


  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full opacity-50" />;
};

export default ThreeScene;
