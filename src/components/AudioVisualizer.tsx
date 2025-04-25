"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import * as THREE from "three";
import { useControls, Leva } from "leva";

// Extend R3F with postprocessing effects
extend({ EffectComposer, RenderPass, UnrealBloomPass, OutputPass });

// Define interfaces for our controls and props
interface BloomSettings {
  threshold: number;
  strength: number;
  radius: number;
}

interface ColorSettings {
  red: number;
  green: number;
  blue: number;
}

interface EffectsProps {
  bloom: BloomSettings;
}

interface AudioSphereProps {
  audioUrl: string;
}

interface SoundVisualizerProps {
  audioUrl?: string;
  width?: number;
  height?: number;
}

interface MousePosition {
  x: number;
  y: number;
}

// Vertex shader for audio-reactive geometry
const vertexShader = `
  uniform float u_time;

  vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+10.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
  }

  uniform float u_frequency;

  void main() {
      float noise = 3.0 * pnoise(position + u_time, vec3(10.0));
      float displacement = (u_frequency / 30.) * (noise / 10.);
      vec3 newPosition = position + normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment shader for coloring the geometry
const fragmentShader = `
  uniform float u_red;
  uniform float u_green;
  uniform float u_blue;
  void main() {
      gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1.);
  }
`;

// Effects and post-processing setup
function Effects({ bloom }: EffectsProps): JSX.Element {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer>(null);

  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height);
    }
  }, [size]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attach="passes" args={[scene, camera]} />
      <UnrealBloomPass attachArray="passes" args={[new THREE.Vector2(size.width, size.height), bloom.strength, bloom.radius, bloom.threshold]} />
      <outputPass attachArray="passes" />
    </effectComposer>
  );
}

// Audio reactive geometry
function AudioSphere({ audioUrl }: AudioSphereProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  interface ControlSettings {
    colorSettings: {
      red: number;
      green: number;
      blue: number;
    };
    bloomSettings: {
      threshold: number;
      strength: number;
      radius: number;
    };
  }

  const controls = useControls({
    colorSettings: {
      red: { min: 0, max: 1, step: 0.01 },
      green: { min: 0, max: 1, step: 0.01 },
      blue: { min: 0, max: 1, step: 0.01 },
    },
    bloomSettings: {
      threshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
      strength: { value: 0.5, min: 0, max: 3, step: 0.01 },
      radius: { value: 0.8, min: 0, max: 1, step: 0.01 },
    },
  });

  const colorSettings = controls.colorSettings;
  // Removed unused bloomSettings declaration

  // Initialize audio analysis
  useEffect(() => {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Create audio element and source
    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // Connect to analyzer
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyserRef.current = analyser;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioContext.close();
    };
  }, [audioUrl]);

  // Handle audio playback
  const togglePlayback = (): void => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update uniforms based on audio data
  useFrame(({ clock }) => {
    if (!meshRef.current?.material || !analyserRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;

    // Update time uniform
    material.uniforms.u_time.value = clock.getElapsedTime();

    // Update audio frequency uniform
    if (isPlaying && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setFrequency(average);
      material.uniforms.u_frequency.value = average;
    }

    // Smooth rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_frequency: { value: frequency },
        u_red: { value: colorSettings.red },
        u_green: { value: colorSettings.green },
        u_blue: { value: colorSettings.blue },
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
    });
  }, [colorSettings.red, colorSettings.green, colorSettings.blue, frequency]);

  // Update color uniforms when controls change
  useEffect(() => {
    if (meshRef.current?.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_red.value = colorSettings.red;
      material.uniforms.u_green.value = colorSettings.green;
      material.uniforms.u_blue.value = colorSettings.blue;
    }
  }, [colorSettings]);

  return (
    <mesh ref={meshRef} material={shaderMaterial} onClick={togglePlayback}>
      <icosahedronGeometry args={[4, 30]} />
    </mesh>
  );
}

function SoundVisualizer({ audioUrl = "/assets/Beats.mp3", width = 800, height = 600 }: SoundVisualizerProps): JSX.Element {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  // Handle mouse movement for camera interaction
  const handleMouseMove = (e: MouseEvent): void => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    setMousePosition({
      x: (e.clientX - windowHalfX) / 100,
      y: (e.clientY - windowHalfY) / 100,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Custom camera that responds to mouse movement
  function CameraRig(): null {
    const { camera } = useThree();

    useFrame(() => {
      camera.position.x += (mousePosition.x - camera.position.x) * 0.05;
      camera.position.y += (-mousePosition.y - camera.position.y) * 0.5;
      camera.lookAt(0, 0, 0);
    });

    return null;
  }

  const { bloomSettings } = useControls({
    bloomSettings: {
      threshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
      strength: { value: 0.5, min: 0, max: 3, step: 0.01 },
      radius: { value: 0.8, min: 0, max: 1, step: 0.01 },
    },
  });

  return (
    <div className="relative w-full h-full">
      <Canvas style={{ width, height }}>
        <PerspectiveCamera makeDefault position={[0, -2, 14]} />
        <CameraRig />
        <AudioSphere audioUrl={audioUrl} />
        <Effects bloom={bloomSettings} />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
        <p className="text-white">Click the Sphere to Toggle Sound</p>
      </div>
      <div className="absolute top-4 right-4">
        <Leva collapsed />
      </div>
    </div>
  );
}

export default SoundVisualizer;
