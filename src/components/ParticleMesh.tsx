"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleMeshProps {
  animationState?: "idle" | "suck-in" | "expand-out";
  onAnimationComplete?: (phase: "suck-in" | "expand-out") => void;
}

const SUCK_DURATION = 1000;
const EXPAND_DURATION = 1000;
const DRIFT_SPEED = 0.00056;
const PARTICLE_COUNT = 1182;

function easeInCubic(t: number) {
  return t * t * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// --- Shaders: circle points via gl_PointCoord ---
const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    gl_FragColor = vec4(uColor, uOpacity * alpha);
  }
`;

export default function ParticleMesh({
  animationState = "idle",
  onAnimationComplete,
}: ParticleMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animPhaseRef = useRef<"idle" | "suck-in" | "expand-out">(
    animationState === "idle" ? "idle" : animationState
  );
  const animStartTimeRef = useRef<number>(
    animationState === "expand-out" ? performance.now() : 0
  );
  const animCompleteCbRef = useRef(onAnimationComplete);
  const animDoneRef = useRef(false);

  animCompleteCbRef.current = onAnimationComplete;

  useEffect(() => {
    if (animationState !== animPhaseRef.current) {
      animPhaseRef.current = animationState;
      animStartTimeRef.current = performance.now();
      animDoneRef.current = false;
    }
  }, [animationState]);

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

    const CAMERA_REST = isWide ? 5 : 3;
    const CAMERA_SUCK_TARGET = isWide ? 0.5 : 0.3; // fly into center
    const CAMERA_EXPAND_START = isWide ? 10 : 6; // arrive from far behind

    // Set initial camera position based on animation state
    if (animPhaseRef.current === "expand-out") {
      camera.position.z = CAMERA_EXPAND_START;
    } else {
      camera.position.z = CAMERA_REST;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const radius = isWide ? 6.0 : 3.5;
    const actualCount = isWide ? PARTICLE_COUNT : Math.round(PARTICLE_COUNT * 0.595);

    // Random particles distributed uniformly in sphere volume
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // cube root for uniform volume
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x00ff41) },
        uOpacity: { value: 0.6 },
        uSize: { value: isWide ? 0.06 : 0.028 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, pointsMat);
    scene.add(points);

    let driftAngle = 0;

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const phase = animPhaseRef.current;
      const now = performance.now();

      // --- Camera Z animation (stars stay in place, camera flies through) ---
      if (phase === "suck-in" && !animDoneRef.current) {
        const elapsed = now - animStartTimeRef.current;
        const t = Math.min(elapsed / SUCK_DURATION, 1);
        const eased = easeInCubic(t);

        // Fly forward: REST → SUCK_TARGET
        camera.position.z =
          CAMERA_REST + (CAMERA_SUCK_TARGET - CAMERA_REST) * eased;

        if (t >= 1) {
          // Jump camera behind for seamless expand-out
          camera.position.z = CAMERA_EXPAND_START;
          animPhaseRef.current = "expand-out";
          animStartTimeRef.current = now;
          animDoneRef.current = false;
          animCompleteCbRef.current?.("suck-in");
        }
      } else if (phase === "expand-out" && !animDoneRef.current) {
        const elapsed = now - animStartTimeRef.current;
        const t = Math.min(elapsed / EXPAND_DURATION, 1);
        const eased = easeOutCubic(t);

        // Fly forward: EXPAND_START → REST
        camera.position.z =
          CAMERA_EXPAND_START + (CAMERA_REST - CAMERA_EXPAND_START) * eased;

        if (t >= 1) {
          camera.position.z = CAMERA_REST;
          animDoneRef.current = true;
          animCompleteCbRef.current?.("expand-out");
        }
      }

      // --- Constant slow drift (always, all phases) ---
      driftAngle += DRIFT_SPEED;
      points.rotation.x = Math.sin(driftAngle * 0.6) * 0.15;
      points.rotation.y = driftAngle;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      pointsMat.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
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
