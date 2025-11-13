"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useRef, useMemo } from "react"

function Blocks() {
  const ref = useRef<any>(null)

  const positions = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      arr.push([
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.5,
      ])
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.12
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
  })

  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <Float key={i} floatIntensity={0.5} rotationIntensity={0.4}>
          <mesh position={p}>
            <boxGeometry args={[0.5, 0.3, 0.1]} />
            <meshStandardMaterial
              color={i % 2 ? "#5B5BFF" : "#0A84FF"}
              metalness={0.4}
              roughness={0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 4]} intensity={1.1} />
        <Environment preset="city" />
        <Blocks />
        <EffectComposer>
          <Bloom intensity={0.4} luminanceThreshold={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}