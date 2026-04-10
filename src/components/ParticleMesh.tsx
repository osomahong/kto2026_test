"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleMesh() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isWide = window.innerWidth >= 1024;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = isWide ? 7 : 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const radius = isWide ? 4.5 : 2.5;

    const geometry = new THREE.IcosahedronGeometry(radius, 4);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x4f8ef7,
      size: isWide ? 0.025 : 0.02,
      transparent: true,
      opacity: 0.6,
    });
    const points = new THREE.Points(geometry, pointsMat);
    scene.add(points);

    const wireGeo = new THREE.WireframeGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3f78e0,
      transparent: true,
      opacity: 0.1,
    });
    const wireframe = new THREE.LineSegments(wireGeo, lineMat);
    scene.add(wireframe);

    const target = { x: 0, y: 0 };
    let autoAngle = 0;
    let isDragging = false;
    let lastTouch = { x: 0, y: 0 };
    let hasInteraction = false;

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (hasInteraction) {
        points.rotation.x += (target.x - points.rotation.x) * 0.04;
        points.rotation.y += (target.y - points.rotation.y) * 0.04;
      } else {
        autoAngle += 0.0025;
        points.rotation.x = Math.sin(autoAngle * 0.7) * 0.25;
        points.rotation.y = autoAngle;
      }

      wireframe.rotation.x = points.rotation.x;
      wireframe.rotation.y = points.rotation.y;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Desktop: mouse position controls rotation
    const handleMouseMove = (e: MouseEvent) => {
      hasInteraction = true;
      target.x = (e.clientY / window.innerHeight - 0.5) * 1.2;
      target.y = (e.clientX / window.innerWidth - 0.5) * 1.2;
    };

    // Mobile: drag delta controls rotation
    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      const t = e.touches[0];
      lastTouch.x = t.clientX;
      lastTouch.y = t.clientY;
      // Sync target to current rotation so drag starts smoothly
      if (!hasInteraction) {
        target.x = points.rotation.x;
        target.y = points.rotation.y;
        hasInteraction = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const t = e.touches[0];
      const dx = t.clientX - lastTouch.x;
      const dy = t.clientY - lastTouch.y;
      target.y -= dx * 0.0054;
      target.x -= dy * 0.0054;
      lastTouch.x = t.clientX;
      lastTouch.y = t.clientY;
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousemove", handleMouseMove);
    // Touch events on document so they work even when touching UI elements on top
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
