import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls,useGLTF } from '@react-three/drei';
import { TextureLoader, BackSide, DirectionalLight, AdditiveBlending, Float32BufferAttribute } from 'three';

// Earth Component with clouds and atmosphere
function Earth() {
  const earthRef = useRef();
  const lightRef = useRef();
  const cloudsRef = useRef();
  const groupRef = useRef();
  // Load Earth textures
  const [
    earthMap,
    cloudsMap,
    normalMap,
    specularMap
  ] = useLoader(TextureLoader, [
    '/earthmap1k.jpg',      // Color map
    '/earthcloudmap.jpg',   // Clouds
    '/earthlights1k.jpg',   // Normal map
    '/earthspec1k.jpg'      // Specular map
  ]);

  useFrame(({ clock }) => {
    // Rotate Earth
    earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    lightRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    // Rotate clouds slightly faster
    cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.15;
  });
  useEffect(() => {
    groupRef.current.rotation.z = -23.4 * Math.PI / 180;
  }, []);

  return (
    <group ref={groupRef} args={[0, 0, 0]}>
      {/* Earth sphere */}

      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          map={earthMap}
        //   normalMap={normalMap}
          // specularMap={specularMap}
        //   shininess={5}
        //   blending={AdditiveBlending}
        />
      </mesh>
      <Satellite url={'/simple_satellite_low_poly_free.glb'}/>

      <mesh ref={lightRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          map={normalMap}
          blending={AdditiveBlending}
        //   normalMap={normalMap}
        //   specularMap={specularMap}
        //   shininess={5}
        //   blending={AdditiveBlending}
        />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshPhongMaterial
          color="#88b2ff"
          side={BackSide}
        //   transparent={true}
          opacity={0.3}
          blending={AdditiveBlending}

        />
      </mesh>
    </group>
  );
}
function Satellite({ url, speed = 0.5, orbitRadius = 4, tiltAngle = 0.3 }) { // tiltAngle in radians
    const satelliteRef = useRef();
    const { scene } = useGLTF(url);
    
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        
        // Calculate position on the circular path with tilt
        const theta = time * speed;
        
        // Calculate base orbital position
        satelliteRef.current.position.x = Math.sin(theta) * orbitRadius * -1;
        satelliteRef.current.position.z = Math.cos(theta) * orbitRadius * -1;
        
        // Add y-position for tilt
        // satelliteRef.current.position.y = Math.sin(theta) * orbitRadius * Math.sin(tiltAngle);
        
        // Make the model face the center while maintaining tilt
        satelliteRef.current.lookAt(0, 0, 0);
        // satelliteRef.current.rotation.y += delta * 20; 
        // Apply additional rotation to maintain proper orientation
        satelliteRef.current.rotateY(0.5);
    });
  
    return (
        <primitive 
            ref={satelliteRef}
            object={scene} 
            scale={0.2}
        />
    );
}
function Stars() {
  const starsRef = useRef();
  
  useEffect(() => {
    const starCount = 1000;
    const radius = 50; // Define the spherical boundary
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      let theta = Math.random() * Math.PI * 2; // Random angle around the sphere
      let phi = Math.acos((Math.random() * 2) - 1); // Random angle for spherical distribution

      let x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.sin(phi) * Math.sin(theta);
      let z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    starsRef.current.geometry.setAttribute(
      'position',
      new Float32BufferAttribute(positions, 3)
    );
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial attach="material" size={0.2} color="white" />
    </points>
  );
}


const EarthSatelliteSystem = () => {
  return (
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.1} />
       <directionalLight position={[-2,1,2]} intensity={2}/>
        {/* <pointLight position={[10, 0, 10]} intensity={1} /> */}
        

        <Suspense fallback={null}>
          <Earth />
          <Stars />
        </Suspense>

        <OrbitControls 
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
        //   autoRotate
        //   autoRotateSpeed={0.5}
        />

        {/* Optional star field */}
      </Canvas>
  );
};

// Optional Stars background


export default EarthSatelliteSystem;