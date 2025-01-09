import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, morphMesh;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Load the model
  const loader = new GLTFLoader();
  loader.load('/assets/alien.glb', function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Find the mesh with morph targets
    morphMesh = model.getObjectByProperty('isMesh', true);
    if (morphMesh && morphMesh.morphTargetInfluences) {
      console.log('Morph targets:', morphMesh.morphTargetInfluences);
    }
  });

  // Animation loop
  renderer.setAnimationLoop(animate);
}

function animate() {
  if (morphMesh && morphMesh.morphTargetInfluences) {
    // Example: Animate morph influence
    const time = performance.now() / 1000;
    morphMesh.morphTargetInfluences[0] = (Math.sin(time) + 1) / 2; // Oscillate between 0 and 1
  }

  controls.update();
  renderer.render(scene, camera);
}

init();