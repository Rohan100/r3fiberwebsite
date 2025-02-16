import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'
import { AmbientLight, DirectionalLight, SphereGeometry } from 'three'

const Cube = () =>  {
  const meshRef = useRef()
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta
    meshRef.current.position.z = Math.sin(state.clock.elapsedTime) * 0.5
  })

  return(
    <mesh ref={meshRef} position={[0, 0, 3]}>
    <sphereGeometry  args={[1,32,32]} />
    <meshStandardMaterial color="hotpink" wireframe />
  </mesh>
  )
}

function App() {
  
  return (
    <Canvas>
      <directionalLight position={[0, 0, 5]} />
      <ambientLight  />
      <Cube />
    </Canvas>
  )
}

export default App