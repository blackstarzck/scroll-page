import * as THREE from 'three';
import { house } from './House.js'
import { House } from './House.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white')

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(-5, 2, 25)
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('#FFFFFF', 2);
const directionalLight = new THREE.DirectionalLight('#FFFFFF', 2)
// ambientLight.position.set(0, 10, 0);
directionalLight.position.set(1,0,2);
scene.add(ambientLight, directionalLight);

const spotLight = new THREE.SpotLight('#FF0000', .7);
spotLight.position.set(0, 10, 10);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

// const lightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(lightHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

const gltfLoader = new GLTFLoader();

// Mesh
const floorMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100),
	new THREE.MeshStandardMaterial({
		color: '#FFFFFF'
	})
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const houses = [];

houses.push(new House({	gltfLoader,	scene,	modelSrc: './models/house.glb',	x: -5, z: 20, height: 2 }));
houses.push(new House({	gltfLoader,	scene,	modelSrc: './models/house.glb',	x: 7, z: 10, height: 2 }));
houses.push(new House({	gltfLoader,	scene,	modelSrc: './models/house.glb',	x: -10, z: 0, height: 2 }));
houses.push(new House({	gltfLoader,	scene,	modelSrc: './models/house.glb',	x: 10, z: -10, height: 2 }));
houses.push(new House({	gltfLoader,	scene,	modelSrc: './models/house.glb',	x: -5, z: -20, height: 2 }));

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);


// const gui = new dat.GUI();
// gui.add(spotLight.position, 'x', -5, 5);
// gui.add(spotLight.position, 'y', -5, 5);
// gui.add(spotLight.position, 'z', -5, 5);

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

let currentSection = 0;
function setSection(){
	const newSection = Math.round(window.scrollY / window.innerHeight);

	if(currentSection !== newSection){
		gsap.to(camera.position, {
			duration: 1,
			x: houses[newSection].x,
			z: houses[newSection].z + 5
		});
	};
	currentSection = newSection;
}

// 이벤트
window.addEventListener('resize', setSize);

window.addEventListener('scroll', setSection)

draw();
