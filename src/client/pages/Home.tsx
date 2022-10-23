import * as THREE from 'three'
import { GLTF } from 'three-stdlib'
import * as React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'
import { useControls } from 'leva'

type Action = 'Survey' | 'Walk' | 'Run'
type FoxGLTF = GLTF & {
  nodes: {
    fox: THREE.SkinnedMesh
    _rootJoint: THREE.Bone
  }
} & {
  materials: {
    fox_material: THREE.MeshStandardMaterial
  }
}

const Fox = ({
  action,
  ...props
}: JSX.IntrinsicElements['group'] & { action: Action }) => {
  const ref = useRef<THREE.Group>(null)
  const { nodes, animations, materials } = useGLTF(
    'models/Fox/glTF-Binary/Fox.glb'
  ) as unknown as FoxGLTF
  const { actions } = useAnimations(animations, ref)
  useEffect(() => {
    actions[action]?.reset().fadeIn(0.2).play() // eslint-disable-line
    return () => {
      actions[action]?.fadeOut(0.2)
    }
  }, [action, actions])

  return (
    <group ref={ref} {...props} dispose={null}>
      <group scale={0.01}>
        <primitive object={nodes['_rootJoint']} />
        <skinnedMesh
          receiveShadow
          castShadow
          geometry={nodes['fox'].geometry}
          skeleton={nodes['fox'].skeleton}
          material={materials['fox_material']}
          scale={100}
        />
      </group>
    </group>
  )
}

const Home = () => {
  const { action } = useControls({
    action: { options: ['Walk', 'Survey', 'Run'] },
  })

  return (
    <Canvas camera={{ position: [2, 2, 2] }}>
      <OrbitControls enableDamping={false} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Fox action={action as Action} />
    </Canvas>
  )
}

export default Home
