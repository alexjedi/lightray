'use client'

import * as THREE from 'three'
import { useRef, useCallback, useState } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import { Bloom, EffectComposer, LUT } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import { Beam } from '@/components/Beam'
import { Rainbow } from '@/components/Rainbow'
import { Prism } from '@/components/Prism'
import { Flare } from '@/components/Flare'
import { lerp, lerpV3 } from '@/lib/utils'

// import lutTex from '@/lib/lut/F-6800-STD.cube?url'
import inter from '@/lib/fonts/inter.json'

export default function App() {
  // const texture = useLoader(LUTCubeLoader, lutTex)
  return (
    <Canvas
      orthographic
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 100], zoom: 70 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['black']} />
      <Scene />
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          levels={9}
          intensity={1.5}
          luminanceThreshold={1}
          luminanceSmoothing={1}
        />
        {/* <LUT lut={texture} /> */}
      </EffectComposer>
    </Canvas>
  )
}

function Scene() {
  const [isPrismHit, hitPrism] = useState(false)
  const flare = useRef(null)
  const ambient = useRef(null)
  const spot = useRef(null)
  const boxreflect = useRef(null)
  const rainbow = useRef(null)

  const rayOut = useCallback(() => hitPrism(false), [])
  const rayOver = useCallback((e) => {
    // Break raycast so the ray stops when it touches the prism
    e.stopPropagation()
    hitPrism(true)
    // Set the intensity really high on first contact
    rainbow.current.material.speed = 1
    rainbow.current.material.emissiveIntensity = 20
  }, [])

  const vec = new THREE.Vector3()
  const rayMove = useCallback(({ api, position, direction, normal }) => {
    if (!normal) return
    // Extend the line to the prisms center
    vec.toArray(api.positions, api.number++ * 3)
    // Set flare
    flare.current.position.set(position.x, position.y, -0.5)
    flare.current.rotation.set(0, 0, -Math.atan2(direction.x, direction.y))

    // Always set the rainbow to reflect to the right
    rainbow.current.rotation.z = 0 // 45 degrees to the right
    rainbow.current.position.set(position.x + 0.5, position.y - 0.5, 0) // Offset to the right and slightly down

    // Set spot light to follow the rainbow
    spot.current.target.position.set(position.x + 1, position.y - 1, 0)
    spot.current.target.updateMatrixWorld()
  }, [])

  useFrame((state) => {
    // Set beam to come from the top of the canvas
    boxreflect.current.setRay([0, state.viewport.height / 2, 0], [0, -1, 0])
    // Animate rainbow intensity
    lerp(rainbow.current.material, 'emissiveIntensity', isPrismHit ? 2.5 : 0, 0.1)
    spot.current.intensity = rainbow.current.material.emissiveIntensity
    // Animate ambience
    // lerp(ambient.current, 'intensity', 0, 0.025)
  })

  return (
    <>
      {/* Lights */}
      <ambientLight ref={ambient} intensity={2} />
      <pointLight position={[10, -10, 0]} intensity={1.05 * Math.PI} decay={0} />
      <pointLight position={[0, 10, 0]} intensity={1.05 * Math.PI} decay={0} />
      <pointLight position={[-10, 0, 0]} intensity={1.05 * Math.PI} decay={0} />
      <spotLight
        ref={spot}
        intensity={Math.PI}
        decay={0}
        distance={7}
        angle={1}
        penumbra={1}
        position={[0, 0, 1]}
      />
      {/* Caption */}
      <Center top bottom position={[0, 2, 0]}>
        <Text3D size={0.7} letterSpacing={-0.05} height={0.05} font={inter}>
          Dark side of the Moon
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
      {/* Prism + reflect beam */}
      <Beam ref={boxreflect} bounce={10} far={20}>
        <Prism position={[0, -3, 0]} onRayOver={rayOver} onRayOut={rayOut} onRayMove={rayMove} />
      </Beam>
      {/* Rainbow and flares */}
      <Rainbow ref={rainbow} startRadius={0} endRadius={0.5} fade={0} />
      <Flare
        ref={flare}
        visible={isPrismHit}
        renderOrder={10}
        scale={1.25}
        streak={[12.5, 20, 1]}
      />
    </>
  )
}
