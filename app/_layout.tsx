import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { Suspense, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as THREE from 'three'; // We need this to create new colors/materials

// Add this right below your imports!
const EXERCISE_DATABASE = {
  'Front Raise': [
    { mesh: 'clavicular', color: '#ff2222', glow: '#440000' } // Primary: Front Delt
  ],
  'Lateral Raise': [
    { mesh: 'acromial', color: '#ff2222', glow: '#440000' },   // Primary: Side Delt
    { mesh: 'clavicular', color: '#ff8800', glow: '#442200' }  // Secondary: Front Delt (Orange)
  ],
  'Reverse Fly': [
    { mesh: 'scapular', color: '#ff2222', glow: '#440000' }    // Primary: Rear Delt
  ]
};

// 1. The 3D Model Component (Now accepts the 'activeExercise' as a prop)
function ShoulderModel({ activeExercise }) {
  const { scene } = useGLTF(require('../assets/test1_shoulder.glb'));

  // This hook runs every time the activeExercise changes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const meshName = child.name.toLowerCase();

        // 1. Color the skeleton
        if (meshName.includes('parietal_boner')) {
          child.material = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.9 });
          return; 
        }

        // 2. Default color for inactive muscles
        let targetColor = '#6b4c4c'; 
        let glowColor = '#000000';

        // 3. The New Magic: Look up the exercise in our database
        const activeData = EXERCISE_DATABASE[activeExercise];

        if (activeData) {
          // Loop through the muscles used in this exercise
          activeData.forEach((muscle) => {
            if (meshName.includes(muscle.mesh)) {
              targetColor = muscle.color;
              glowColor = muscle.glow;
            }
          });
        }

        // 4. Apply the color
        child.material = new THREE.MeshStandardMaterial({ 
          color: targetColor,
          emissive: glowColor
        });
      }
    });
  }, [activeExercise, scene]);

  return <primitive object={scene} />;
}

// 2. The Main App Screen
export default function App() {
  // State to track which exercise is active (default is None)
  const [exercise, setExercise] = useState('None');

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shoulder Activation</Text>
        <Text style={styles.subtitle}>Current: {exercise}</Text>
      </View>

      {/* 3D Canvas */}
      <View style={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          
          <Suspense fallback={null}>
            <Center>
              {/* We pass the state down into the model here */}
              <ShoulderModel activeExercise={exercise} />
            </Center>
            <Environment preset="city" />
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </View>

      {/* UI Buttons at the bottom */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setExercise('Front Raise')}>
          <Text style={styles.buttonText}>Front Raise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => setExercise('Lateral Raise')}>
          <Text style={styles.buttonText}>Lateral Raise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => setExercise('Reverse Fly')}>
          <Text style={styles.buttonText}>Reverse Fly</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// 3. Styling
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center', backgroundColor: '#1e1e1e' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#ff5555', fontSize: 16, marginTop: 5, fontWeight: 'bold' },
  canvasContainer: { flex: 1 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
    backgroundColor: '#1e1e1e',
    paddingBottom: 40, // Extra padding for modern phone screens
  },
  button: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: { color: '#ffffff', fontWeight: 'bold' }
});