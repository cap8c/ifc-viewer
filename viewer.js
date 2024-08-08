import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { IFCLoader } from 'three/addons/loaders/IFCLoader.js';

let scene, camera, renderer, controls, ifcLoader;

function Init3DView() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  const obj = document.getElementById("3dcontainer");
  obj.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(45, obj.clientWidth / obj.clientHeight, 0.1, 1000);
  renderer.setSize(obj.clientWidth - 20, obj.clientHeight - 20);
  window.addEventListener('resize', onWindowResize, false);

  controls = new OrbitControls(camera, renderer.domElement);

  scene.background = new THREE.Color(0x8cc7de);

  InitBasicScene();

  camera.position.z = 5;

  // Initialize IFC Loader
  ifcLoader = new IFCLoader();
  ifcLoader.setWasmPath('https://cap8c.github.io/ifc-viewer/'); // Ensure this path is correct
  ifcLoader.load('RST_basic_sample_project.ifc', (ifcModel) => {
    scene.add(ifcModel);
  });

  AnimationLoop();
}

function InitBasicScene() {
  const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 0.8);
  directionalLight1.position.set(1, 1, 1);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight2.position.set(-1, 0.5, -1);
  scene.add(directionalLight2);

  const ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
  scene.add(ambientLight);
}

function onWindowResize() {
  const obj = document.getElementById("3dcontainer");
  camera.aspect = obj.clientWidth / obj.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(obj.clientWidth - 20, obj.clientHeight - 20);
}

function AnimationLoop() {
  requestAnimationFrame(AnimationLoop);
  controls.update();
  renderer.render(scene, camera);
}

Init3DView();
