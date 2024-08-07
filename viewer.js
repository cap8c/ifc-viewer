import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { IFCLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/IFCLoader.js';

let scene, camera, renderer, ifcLoader;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  
  // Camera
  camera = a new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 20);
  
  // Renderer
  renderer = a new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Lights
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);
  
  // IFC Loader
  ifcLoader = a new IFCLoader();
  ifcLoader.load('RST_basic_sample_project.ifc', (ifcModel) => {
    scene.add(ifcModel);
  });
  
  // Resize handler
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
