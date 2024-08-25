import * as THREE from 'three'
import { forwardRef, useRef } from 'react'
import { useTexture, Instances, Instance } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const tex1 = '/textures/lensflare/lensflare2.png'
const tex2 = '/textures/lensflare/lensflare3.png'
const tex3 = '/textures/lensflare/lensflare0_bw.png'

export const Flare = forwardRef(({ streak = [8, 20, 1], visible, ...props }, fRef) => {
  const ref = useRef(null)
  const [streakTexture, dotTexture, glowTexture] = useTexture([tex1, tex2, tex3])
  const config = {
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }

  useFrame((state) => {
    ref.current.children.forEach((instance) => {
      instance.position.x =
        (Math[instance.scale.x > 1 ? 'sin' : 'cos'](
          (state.clock.elapsedTime * instance.scale.x) / 2
        ) *
          instance.scale.x) /
        8
      instance.position.y =
        (Math[instance.scale.x > 1 ? 'cos' : 'atan'](state.clock.elapsedTime * instance.scale.x) *
          instance.scale.x) /
        5
    })
  })

  return (
    <group ref={fRef} {...props} dispose={null}>
      <Instances frames={visible ? Infinity : 1}>
        <planeGeometry />
        <meshBasicMaterial map={dotTexture} {...config} />
        <group ref={ref}>
          <Instance scale={0.5} />
          <Instance scale={1.25} />
          <Instance scale={0.75} />
          <Instance scale={1.5} />
          <Instance scale={2} position={[0, 0, -0.7]} />
        </group>
      </Instances>
      <mesh scale={1}>
        <planeGeometry />
        <meshBasicMaterial map={glowTexture} {...config} opacity={1} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={streak}>
        <planeGeometry />
        <meshBasicMaterial map={streakTexture} {...config} opacity={1} />
      </mesh>
    </group>
  )
})
