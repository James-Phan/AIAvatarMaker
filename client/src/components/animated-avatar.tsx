import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface AnimatedAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export default function AnimatedAvatar({ isListening, isSpeaking }: AnimatedAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Thiết lập scene, camera, và renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Tạo hình đầu avatar
    const headGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffdab9,
      specular: 0x050505,
      shininess: 100
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    scene.add(head);
    
    // Thêm mắt
    const eyeGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const pupilGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    // Mắt trái
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.5, 0.3, 1.2);
    head.add(leftEye);
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0, 0, 0.2);
    leftEye.add(leftPupil);
    
    // Mắt phải
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 0.3, 1.2);
    head.add(rightEye);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0, 0, 0.2);
    rightEye.add(rightPupil);
    
    // Miệng
    const mouthGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
    const mouthMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xcc6666,
      side: THREE.DoubleSide
    });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.5, 1.4);
    mouth.rotation.x = Math.PI / 2;
    head.add(mouth);
    
    // Thêm ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    let mouthScale = 1;
    let targetMouthScale = 1;
    let headRotation = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animation cho miệng khi đang nói
      if (isSpeaking) {
        // Random scale cho miệng tạo hiệu ứng nói
        if (Math.random() > 0.7) {
          targetMouthScale = 0.5 + Math.random() * 1.5;
        }
      } else {
        targetMouthScale = 1;
      }
      
      mouthScale = mouthScale + (targetMouthScale - mouthScale) * 0.1;
      mouth.scale.set(mouthScale, mouthScale, 1);
      
      // Animation cho đầu nghiêng nhẹ khi lắng nghe
      if (isListening) {
        headRotation = Math.sin(Date.now() * 0.002) * 0.1;
      } else {
        headRotation = headRotation * 0.95;
      }
      
      head.rotation.z = headRotation;
      head.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Animation cho mắt chớp
      if (Math.random() > 0.995) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
        setTimeout(() => {
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }, 150);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    setLoaded(true);
    
    // Thêm xử lý responsive
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose các đối tượng để tránh memory leak
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          }
        }
      });
    };
  }, []);
  
  // Cập nhật animation khi trạng thái thay đổi
  useEffect(() => {
    // Không cần thêm logic ở đây vì chúng ta đã xử lý trong vòng lặp animation
  }, [isListening, isSpeaking]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-lg overflow-hidden"
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}