import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  Sphere,
  Box,
  Cylinder,
  Sky,
  Cloud,
  MeshDistortMaterial,
  Float,
  Icosahedron,
  Octahedron,
  Dodecahedron,
  Sparkles,
  Text,
  Cone,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  ArrowLeft, MapPin, Scan, ShieldCheck, Droplets, Zap, Thermometer, 
  Wind, Filter, FlaskConical, Sun, Skull, CheckCircle2, RefreshCw, AlertTriangle, Info, ArrowRight, Bug, Sprout 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix: Add missing types for Three.js elements in JSX
// Augmenting both 'react' module and global JSX namespace to ensure compatibility
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      pointLight: any;
      ambientLight: any;
      planeGeometry: any;
      cylinderGeometry: any;
      ringGeometry: any;
      gridHelper: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      pointLight: any;
      ambientLight: any;
      planeGeometry: any;
      cylinderGeometry: any;
      ringGeometry: any;
      gridHelper: any;
    }
  }
}

// --- 1. GAME LOGIC & CONSTANTS ---

type ParamKey = 'pH' | 'Temp' | 'Turbidity' | 'DO' | 'TDS' | 'Hardness' | 'EC' | 'Chemicals' | 'Chlorine' | 'Bio';

interface MonsterVariant {
  name: string;
  desc: string;
  behavior: string;
  shape: 'slime' | 'cloud' | 'rock' | 'spiky' | 'crystal' | 'ghost';
  color: string;
}

interface MonsterConfig {
  bad: MonsterVariant;
  extreme: MonsterVariant;
  toolName: string;
  toolDesc: string;
  icon: any;
  natureType: 'flower' | 'cloud' | 'crystal' | 'fish' | 'sand' | 'moss' | 'firefly' | 'tree' | 'bird' | 'butterfly';
}

const MONSTER_CONFIG: Record<ParamKey, MonsterConfig> = {
  pH: {
    toolName: 'Neutralizer Ray',
    toolDesc: 'Fires balancing ions to fix acidity.',
    icon: FlaskConical,
    natureType: 'flower',
    bad: { 
      name: 'Acid Spitter', 
      desc: 'Glowing neon blob bubbling with acidity.', 
      behavior: 'Spits corrosive goop.',
      shape: 'slime',
      color: '#fbbf24' 
    },
    extreme: { 
      name: 'Meltdown Slime', 
      desc: 'A massive, unstable core of pure acid.', 
      behavior: 'Melts everything it touches.',
      shape: 'slime',
      color: '#ef4444'
    }
  },
  Temp: {
    toolName: 'Cooling Mist',
    toolDesc: 'Sprays liquid nitrogen to lower temp.',
    icon: Thermometer,
    natureType: 'cloud',
    bad: { 
      name: 'Heat Haze', 
      desc: 'A shimmering distortion in the air.', 
      behavior: 'Raises local temperature.',
      shape: 'cloud',
      color: '#fdba74'
    },
    extreme: { 
      name: 'Boiling Phantom', 
      desc: 'A red-hot core surrounded by steam.', 
      behavior: 'Boils nearby water.',
      shape: 'cloud',
      color: '#c2410c'
    }
  },
  Turbidity: {
    toolName: 'Coagulant Crystal',
    toolDesc: 'Binds dirt particles so they sink.',
    icon: Filter,
    natureType: 'crystal',
    bad: { 
      name: 'Silt Lurker', 
      desc: 'Swirling shape of dirt.', 
      behavior: 'Hides in dirty water.',
      shape: 'rock',
      color: '#a16207'
    },
    extreme: { 
      name: 'Mud Golem', 
      desc: 'A massive solid creature of dense mud.', 
      behavior: 'Blinds you with heavy mud.',
      shape: 'rock',
      color: '#451a03'
    }
  },
  DO: {
    toolName: 'Aeration Cannon',
    toolDesc: 'Injects life-giving oxygen bubbles.',
    icon: Wind,
    natureType: 'fish',
    bad: { 
      name: 'Gasping Shadow', 
      desc: 'Translucent, pale blue ghost.', 
      behavior: 'Chokes oxygen from the area.',
      shape: 'ghost',
      color: '#94a3b8'
    },
    extreme: { 
      name: 'The Void', 
      desc: 'A dark, oxygen-less vacuum.', 
      behavior: 'Suffocates all nearby life.',
      shape: 'ghost',
      color: '#1e293b'
    }
  },
  TDS: {
    toolName: 'R.O. Shield',
    toolDesc: 'Filters out heavy dissolved solids.',
    icon: Filter,
    natureType: 'sand',
    bad: { 
      name: 'Salt Crust', 
      desc: 'Jagged, heavy rock creature.', 
      behavior: 'Throws heavy salt crystals.',
      shape: 'crystal',
      color: '#fde047'
    },
    extreme: { 
      name: 'Crystal Jag', 
      desc: 'Razor sharp formation of solids.', 
      behavior: 'Crystallizes targets.',
      shape: 'crystal',
      color: '#854d0e'
    }
  },
  Hardness: {
    toolName: 'Softener Wand',
    toolDesc: 'Swaps hard minerals for soft ones.',
    icon: Droplets,
    natureType: 'moss',
    bad: { 
      name: 'Scale Mite', 
      desc: 'Covered in chalky white armor.', 
      behavior: 'Leaves white scale deposits.',
      shape: 'rock',
      color: '#d6d3d1'
    },
    extreme: { 
      name: 'Calcified Titan', 
      desc: 'Indestructible white stone giant.', 
      behavior: 'Encases pipes in stone.',
      shape: 'rock',
      color: '#78716c'
    }
  },
  EC: {
    toolName: 'Grounding Rod',
    toolDesc: 'Safely absorbs excess electrical charge.',
    icon: Zap,
    natureType: 'firefly',
    bad: { 
      name: 'Spark Wisp', 
      desc: 'Ball of erratic electricity.', 
      behavior: 'Zaps nearby water.',
      shape: 'spiky',
      color: '#facc15'
    },
    extreme: { 
      name: 'Voltaic Surge', 
      desc: 'A thunderstorm condensed.', 
      behavior: 'Unleashes chain lightning.',
      shape: 'spiky',
      color: '#3b82f6'
    }
  },
  Chemicals: {
    toolName: 'Carbon Net',
    toolDesc: 'Traps toxins in a microscopic mesh.',
    icon: FlaskConical,
    natureType: 'tree',
    bad: { 
      name: 'Toxin Seep', 
      desc: 'Purple liquid snake.', 
      behavior: 'Leaves a trail of sludge.',
      shape: 'slime',
      color: '#a855f7'
    },
    extreme: { 
      name: 'Venom Hydra', 
      desc: 'Multi-headed beast of waste.', 
      behavior: 'Attacks cause lingering poison.',
      shape: 'slime',
      color: '#581c87'
    }
  },
  Chlorine: {
    toolName: 'Precision Doser',
    toolDesc: 'Adds just enough purifier to clear fog.',
    icon: Droplets,
    natureType: 'bird',
    bad: { 
      name: 'Microbe Shield', 
      desc: 'A weak protective barrier.', 
      behavior: 'Protects other germs.',
      shape: 'ghost',
      color: '#2dd4bf'
    },
    extreme: { 
      name: 'Septic Fog', 
      desc: 'Thick grey mist.', 
      behavior: 'Accelerates pathogen growth.',
      shape: 'ghost',
      color: '#134e4a'
    }
  },
  Bio: {
    toolName: 'UV Light Saber',
    toolDesc: 'Zaps bacteria with ultraviolet light.',
    icon: Bug,
    natureType: 'butterfly',
    bad: { 
      name: 'Germ Swarm', 
      desc: 'Cluster of spiky spheres.', 
      behavior: 'Multiplies rapidly.',
      shape: 'spiky',
      color: '#86efac'
    },
    extreme: { 
      name: 'Plague Lord', 
      desc: 'A massive hive-mind of bacteria.', 
      behavior: 'Infects clean water zones.',
      shape: 'spiky',
      color: '#15803d'
    }
  }
};

interface GameMonster {
  id: string;
  type: ParamKey;
  severity: 'bad' | 'extreme';
  value: number;
  position: [number, number, number];
  isCured: boolean;
}

// --- 2. 3D ASSETS ---

const NatureElement = ({ type, position }: { type: string, position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (type === 'fish' || type === 'bird' || type === 'butterfly' || type === 'firefly') {
         // Movement animation for living things
         meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
         meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 2) * 0.2;
         meshRef.current.rotation.y += 0.05;
      } else {
         // Gentle swaying for plants
         meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
      }
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {type === 'flower' && (
          <group scale={0.5}>
            <Cylinder args={[0.1, 0.1, 2]} material-color="#166534" />
            <Sphere args={[0.5]} position={[0, 1, 0]} material-color="#ec4899" />
            <Sphere args={[0.3]} position={[0.4, 0.8, 0]} material-color="#f472b6" />
            <Sphere args={[0.3]} position={[-0.4, 0.8, 0]} material-color="#f472b6" />
          </group>
        )}
        {type === 'tree' && (
          <group scale={0.6} position={[0, -0.5, 0]}>
            <Cylinder args={[0.3, 0.5, 2]} material-color="#78350f" />
            <Cone args={[1.5, 2.5, 8]} position={[0, 2, 0]} material-color="#15803d" />
            <Cone args={[1.2, 2, 8]} position={[0, 3, 0]} material-color="#22c55e" />
          </group>
        )}
        {type === 'cloud' && (
          <Cloud opacity={0.8} speed={0.4} bounds={[3, 1, 1.5]} segments={10} color="white" />
        )}
        {type === 'fish' && (
          <group rotation={[0, Math.PI/2, 0]} scale={0.4}>
             <Sphere args={[1, 16, 16]} scale={[1.5, 0.8, 0.5]} material-color="#f97316" />
             <Cone args={[0.6, 1, 4]} rotation={[0, 0, -Math.PI/2]} position={[-1.2, 0, 0]} material-color="#f97316" />
          </group>
        )}
        {type === 'bird' && (
          <group scale={0.3}>
             <Cone args={[0.5, 1.5, 4]} rotation={[Math.PI/2, 0, 0]} material-color="#38bdf8" />
             <Box args={[2, 0.1, 0.5]} position={[0, 0, 0]} material-color="#7dd3fc" />
          </group>
        )}
        {type === 'butterfly' && (
          <group scale={0.3}>
             <Cylinder args={[0.1, 0.1, 1]} rotation={[Math.PI/2, 0, 0]} material-color="#111" />
             <Sphere args={[0.8]} position={[0.6, 0, 0]} scale={[1, 0.1, 1]} material-color="#a855f7" />
             <Sphere args={[0.8]} position={[-0.6, 0, 0]} scale={[1, 0.1, 1]} material-color="#a855f7" />
          </group>
        )}
        {type === 'crystal' && (
          <Octahedron args={[0.8, 0]} material-color="#67e8f9">
             <meshStandardMaterial transparent opacity={0.8} roughness={0} metalness={0.8} />
          </Octahedron>
        )}
        {type === 'moss' && (
          <Sphere args={[0.8, 8, 8]} scale={[1.2, 0.8, 1.2]} material-color="#84cc16">
             <meshStandardMaterial roughness={1} />
          </Sphere>
        )}
        {type === 'sand' && (
          <group>
             <Sphere args={[0.3]} position={[0.2, 0, 0]} material-color="#fde047" />
             <Sphere args={[0.4]} position={[-0.2, -0.2, 0.2]} material-color="#fcd34d" />
             <Sphere args={[0.25]} position={[0, 0.3, -0.1]} material-color="#fbbf24" />
          </group>
        )}
        {type === 'firefly' && (
          <group>
             <Sphere args={[0.1]} material-color="#facc15" position={[0, 0, 0]}>
                <meshBasicMaterial color="#facc15" />
             </Sphere>
             <pointLight distance={3} intensity={2} color="#facc15" />
          </group>
        )}
      </Float>
    </group>
  );
};

const Monster3D: React.FC<{ data: GameMonster; onClick: () => void }> = ({ data, onClick }) => {
  const config = MONSTER_CONFIG[data.type][data.severity];
  const natureType = MONSTER_CONFIG[data.type].natureType;
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Bobbing animation
      meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * (data.severity === 'extreme' ? 4 : 2)) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (data.isCured) {
      return <NatureElement type={natureType} position={data.position} />;
  }

  const scale = data.severity === 'extreme' ? 1.6 : 1.1;

  return (
    <group position={data.position} ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }} scale={[scale, scale, scale]}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        {/* Monster Shape Logic */}
        {config.shape === 'slime' && (
          <Sphere args={[1, 32, 32]}>
            <MeshDistortMaterial color={config.color} distort={0.6} speed={3} />
          </Sphere>
        )}
        {config.shape === 'rock' && (
          <Dodecahedron args={[1, 0]}>
            <meshStandardMaterial color={config.color} roughness={0.9} />
          </Dodecahedron>
        )}
        {config.shape === 'spiky' && (
          <Octahedron args={[1, 0]}>
            <meshStandardMaterial color={config.color} wireframe={false} />
          </Octahedron>
        )}
        {config.shape === 'crystal' && (
          <Octahedron args={[1, 2]}>
            <meshPhysicalMaterial color={config.color} transmission={0.6} thickness={1} roughness={0} />
          </Octahedron>
        )}
        {(config.shape === 'cloud' || config.shape === 'ghost') && (
          <group>
             <Sphere args={[0.6, 16, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color={config.color} transparent opacity={0.6} />
             </Sphere>
             <Sphere args={[0.5, 16, 16]} position={[0.5, 0.2, 0]}>
                <meshStandardMaterial color={config.color} transparent opacity={0.5} />
             </Sphere>
             <Sphere args={[0.5, 16, 16]} position={[-0.4, -0.3, 0.2]}>
                <meshStandardMaterial color={config.color} transparent opacity={0.5} />
             </Sphere>
          </group>
        )}

        {/* Health Bar / Info */}
        <Html position={[0, 1.8, 0]} center>
          <div className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold whitespace-nowrap backdrop-blur-md border border-white/20 shadow-lg flex flex-col items-center cursor-pointer transition-all hover:scale-110
            ${data.severity === 'extreme' ? 'bg-red-900/90 animate-pulse' : 'bg-slate-900/80'}
          `}>
            <div className="flex items-center gap-1">
               {data.severity === 'extreme' && <Skull className="w-3 h-3 text-red-200" />}
               <span>{config.name}</span>
            </div>
            <span className="text-[9px] opacity-70 uppercase tracking-widest">{data.type}</span>
          </div>
        </Html>
      </Float>
    </group>
  );
};

const Environment = ({ pollutionCount }: { pollutionCount: number }) => {
  const isClean = pollutionCount === 0;
  
  return (
    <>
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, isClean ? 10 : -2]} 
        turbidity={isClean ? 0.5 : 10 + pollutionCount * 2}
        rayleigh={isClean ? 0.5 : 0.1}
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
      />
      <ambientLight intensity={isClean ? 0.8 : 0.4} />
      <pointLight position={[10, 20, 10]} intensity={1} castShadow />
      
      {!isClean && (
        <Cloud opacity={0.5} speed={0.2} position={[0, 10, -20]} color="#57534e" />
      )}

      {/* Ground */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={isClean ? "#4ade80" : "#374151"} roughness={1} />
        </mesh>
        <gridHelper args={[100, 50, isClean ? "#ffffff" : "#000000", isClean ? "#86efac" : "#1f2937"]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.1]} />
      </group>

      {/* Hero Platform */}
      <mesh position={[0, -1.9, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </>
  );
};

// --- 3. UI COMPONENTS ---

const HUD = ({ 
  gameState, 
  monsters, 
  selectedMonster, 
  onScan, 
  onAttack,
  onReset 
}: { 
  gameState: string, 
  monsters: GameMonster[], 
  selectedMonster: GameMonster | null,
  onScan: () => void,
  onAttack: () => void,
  onReset: () => void
}) => {
  
  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(20,184,166,0.6)]">
          <ShieldCheck className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">WATERGUARD HERO</h1>
        <p className="text-xl text-teal-200 font-light mb-8">City Cleaner Edition</p>
        
        <div className="max-w-md bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm mb-8 text-left space-y-4">
           <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-400 mt-1 shrink-0" />
              <p className="text-sm text-slate-300">Scan GPS location for water quality data.</p>
           </div>
           <div className="flex items-start gap-3">
              <Skull className="w-5 h-5 text-red-400 mt-1 shrink-0" />
              <p className="text-sm text-slate-300">Pollutants appear as <b>Monsters</b> based on severity.</p>
           </div>
           <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-green-400 mt-1 shrink-0" />
              <p className="text-sm text-slate-300">Use correct tools to transform pollution into nature.</p>
           </div>
        </div>

        <button 
          onClick={onScan}
          className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 shadow-xl border-b-4 border-teal-800"
        >
          <Scan className="w-6 h-6" /> START PATROL
        </button>
      </div>
    );
  }

  // Scanning Screen
  if (gameState === 'scanning') {
    return (
      <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
        <div className="relative">
           <div className="w-24 h-24 border-4 border-teal-500/30 rounded-full animate-ping absolute inset-0"></div>
           <Scan className="w-24 h-24 text-teal-400 animate-pulse relative z-10" />
        </div>
        <h2 className="text-2xl font-bold mt-8">Analyzing Water Sample...</h2>
        <div className="mt-4 space-y-2 text-center text-slate-400 font-mono text-sm">
           <p>Measuring Turbidity...</p>
           <p>Checking Coliform Count...</p>
           <p>Detecting Chemical Trace...</p>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (gameState === 'victory') {
    return (
      <div className="absolute inset-0 bg-green-900/95 z-50 flex flex-col items-center justify-center text-white animate-fade-in text-center p-6">
        <CheckCircle2 className="w-32 h-32 text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
        <h1 className="text-5xl font-black mb-4 text-green-200">CITY CLEANED!</h1>
        <p className="text-xl mb-8 max-w-lg">
          Excellent work, Hero! The water quality is now restored to <span className="font-bold text-green-300">Safe Levels</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to="/" className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-center border border-white/10">
            Exit to Dashboard
          </Link>
          <button 
            onClick={onReset} 
            className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold flex items-center justify-center gap-2 border-b-4 border-green-800 transition-transform active:scale-95"
          >
            <RefreshCw className="w-5 h-5" /> New Mission
          </button>
        </div>
      </div>
    );
  }

  // Active Game HUD
  const activeMonsters = monsters.filter(m => !m.isCured);
  const activeConfig = selectedMonster ? MONSTER_CONFIG[selectedMonster.type][selectedMonster.severity] : null;
  const toolInfo = selectedMonster ? MONSTER_CONFIG[selectedMonster.type] : null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
      {/* Top Bar */}
      <div className="pointer-events-auto flex justify-between items-start">
        <Link to="/" className="p-2 bg-slate-900/50 text-white rounded-lg hover:bg-slate-900/80 backdrop-blur-md border border-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Threat Level</span>
            <div className="flex gap-1">
               {activeMonsters.map((m) => (
                 <div key={m.id} className={`w-3 h-3 rounded-full ${m.severity === 'extreme' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></div>
               ))}
               {activeMonsters.length === 0 && <span className="text-green-400 text-sm font-bold">CLEAN</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Combat Card */}
      <div className="pointer-events-auto w-full max-w-md mx-auto mb-4">
        {selectedMonster && !selectedMonster.isCured && activeConfig && toolInfo ? (
          <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-slate-700 shadow-2xl animate-slide-up">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
               <div className="flex gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${selectedMonster.severity === 'extreme' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                     {React.createElement(toolInfo.icon, { className: "w-8 h-8" })}
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white leading-tight">{activeConfig.name}</h3>
                     <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-wide">{selectedMonster.type} Monster</p>
                  </div>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedMonster.severity === 'extreme' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'}`}>
                  {selectedMonster.severity}
               </span>
            </div>

            {/* Description Box */}
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 mb-3 space-y-2">
               <p className="text-sm text-slate-200"><span className="text-slate-500 font-bold uppercase text-xs">Behavior:</span> {activeConfig.behavior}</p>
               <p className="text-sm text-teal-200"><span className="text-teal-500 font-bold uppercase text-xs">Required Tool:</span> {toolInfo.toolDesc}</p>
            </div>

            {/* Action Button */}
            <button 
              onClick={onAttack}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-xl font-bold text-lg shadow-lg border-b-4 border-teal-800 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
               <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-70 uppercase font-normal mb-1">Deploy Solution</span>
                  <span>Use {toolInfo.toolName}</span>
               </div>
               <div className="ml-auto bg-teal-700 p-1 rounded-md">
                  <Sprout className="w-5 h-5" />
               </div>
            </button>
          </div>
        ) : (
           activeMonsters.length > 0 && (
             <div className="bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-center mx-auto w-fit animate-bounce-slow">
                <p className="text-white font-medium flex items-center gap-2">
                   <Info className="w-4 h-4 text-teal-400" /> Tap a monster to treat!
                </p>
             </div>
           )
        )}
      </div>
    </div>
  );
};

// --- 4. MAIN GAME COMPONENT ---

const WaterGuardGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'scanning' | 'game' | 'victory'>('intro');
  const [monsters, setMonsters] = useState<GameMonster[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<GameMonster | null>(null);

  const generateMonsters = () => {
    const newMonsters: GameMonster[] = [];
    const keys = Object.keys(MONSTER_CONFIG) as ParamKey[];
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 monsters

    for(let i=0; i<count; i++) {
        const type = keys[Math.floor(Math.random() * keys.length)];
        const isExtreme = Math.random() > 0.6; // 40% chance of extreme
        const severity = isExtreme ? 'extreme' : 'bad';
        
        // Mock values
        let val = 0;
        if (type === 'pH') val = isExtreme ? 9.2 : 5.8;
        else if (type === 'Turbidity') val = isExtreme ? 15 : 4.5;
        else if (type === 'Temp') val = isExtreme ? 38 : 30;
        else val = Math.floor(Math.random() * 100);

        newMonsters.push({
            id: Math.random().toString(36).substr(2, 9),
            type,
            severity,
            value: val,
            position: [
                (Math.random() * 8) - 4,
                (Math.random() * 2) + 0.5,
                (Math.random() * 6) - 4
            ],
            isCured: false
        });
    }
    setMonsters(newMonsters);
  };

  const handleScan = () => {
    setGameState('scanning');
    setTimeout(() => {
      generateMonsters();
      setGameState('game');
    }, 3000);
  };

  const handleAttack = () => {
    if (selectedMonster) {
      const updated = monsters.map(m => m.id === selectedMonster.id ? { ...m, isCured: true } : m);
      setMonsters(updated);
      setSelectedMonster(null);
      
      const remaining = updated.filter(m => !m.isCured);
      if (remaining.length === 0) {
        setTimeout(() => setGameState('victory'), 1500); // Slight delay to see final transformation
      }
    }
  };

  const handleReset = () => {
    setGameState('intro');
    setMonsters([]);
    setSelectedMonster(null);
  };

  const activePollutionCount = monsters.filter(m => !m.isCured).length;

  return (
    <div className="w-full h-[calc(100vh-64px)] relative bg-slate-900">
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
        <Environment pollutionCount={activePollutionCount} />
        
        {gameState === 'game' && monsters.map(m => (
          <Monster3D 
            key={m.id} 
            data={m} 
            onClick={() => !m.isCured && setSelectedMonster(m)} 
          />
        ))}

        {selectedMonster && !selectedMonster.isCured && (
          <mesh position={[selectedMonster.position[0], 0.1, selectedMonster.position[2]]} rotation={[-Math.PI/2, 0, 0]}>
             <ringGeometry args={[0.8, 1, 32]} />
             <meshBasicMaterial color="#f59e0b" opacity={0.6} transparent />
          </mesh>
        )}

        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 - 0.1} minPolarAngle={0.5} />
        <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.3} color="#fff" />
      </Canvas>

      <HUD 
        gameState={gameState} 
        monsters={monsters} 
        selectedMonster={selectedMonster} 
        onScan={handleScan} 
        onAttack={handleAttack} 
        onReset={handleReset} 
      />
    </div>
  );
};

export default WaterGuardGame;