import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// 1. This component loads your 3D file
function ShoulderModel(props) {
  // We use require() to pull the local file from your assets folder
  const { scene } = useGLTF(require('../assets/test1_shoulder.glb'));
  return <primitive object={scene} {...props} />;
}

// 2. This is the main screen of your app
export default function App() {
  return (
    <View style={styles.container}>
      
      {/* Top Navigation / Title Area */}
      <View style={styles.header}>
        <Text style={styles.title}>Shoulder Activation</Text>
        <Text style={styles.subtitle}>Drag to rotate. Pinch to zoom.</Text>
      </View>

      {/* The 3D Canvas Area */}
      <View style={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          {/* Lights so the model isn't a black silhouette */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />

          {/* Suspense waits for the 3D model to load before rendering it */}
          <Suspense fallback={null}>
            <Center>
              {/* Notice I removed the position and scale from here! */}
              <ShoulderModel />
            </Center>
            <Environment preset="city" />
          </Suspense>

          {/* This allows you to spin the model with your finger */}
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </View>

    </View>
  );
}

// 3. Simple dark-mode styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Clean dark background
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 14,
    marginTop: 5,
  },
  canvasContainer: {
    flex: 1,
  }
});