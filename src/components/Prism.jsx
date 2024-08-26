import { useLoader } from '@react-three/fiber'
import { MeshTransmissionMaterial, MeshStandardMaterial } from '@react-three/drei'
import { GLTFLoader } from 'three-stdlib'
import { TextureLoader } from 'three'

export function Prism({ onRayOver, onRayOut, onRayMove, ...props }) {
  const { nodes } = useLoader(GLTFLoader, '/gltf/x.glb?url')
  const texture = useLoader(TextureLoader, '/product-overview.jpg')
  return (
    <group {...props}>
      {/* A low-res, invisible representation of the prism that gets hit by the raycaster */}
      <mesh
        visible={false}
        scale={1.9}
        rotation={[Math.PI / 2, Math.PI, 0]}
        onRayOver={onRayOver}
        onRayOut={onRayOut}
        onRayMove={onRayMove}
      >
        <boxGeometry args={[2, 1, 1]} />
      </mesh>
      <mesh
        visible={true}
        scale={1.9}
        rotation={[Math.PI / 2, Math.PI, 0]}
        onRayOver={onRayOver}
        onRayOut={onRayOut}
        onRayMove={onRayMove}
      >
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* The visible hi-res prism */}
      <mesh
        position={[0, 0.5, 0.6]}
        renderOrder={10}
        scale={3}
        dispose={null}
        geometry={nodes.Cube042.geometry}
      >
        {/* <MeshTransmissionMaterial
          clearcoat={1}
          transmission={1}
          thickness={2}
          roughness={0}
          anisotropy={0.1}
          chromaticAberration={1}
          toneMapped={false}
        /> */}
        <meshStandardMaterial
          color="#888"
          metalness={1.2}
          roughness={0.3}
          opacity={0.2}
          transparent
        />
      </mesh>
    </group>
  )
}

Prism.displayName = 'Prism'
