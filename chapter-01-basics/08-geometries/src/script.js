import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object - Let's create a custom geometry using the BufferGeometry class
const geometry = new THREE.BufferGeometry();
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 3, 4);

/**
 * A geometry is a collection of vertices and faces that define the shape of an object.
 * In Three.js, there are two main types of geometries:
 * - Geometry: The original geometry class that was available in Three.js. It is now deprecated in favor of BufferGeometry.
 * - BufferGeometry: The newer and more efficient geometry class that is recommended for most use cases.
 * The BufferGeometry class is more efficient because it stores the vertex data in a single buffer, which is better for performance.
 *
 * Let's create a set of 3 vertices to define a triangle.
 */
// const positionsArray = new Float32Array([
//     0,
//     0,
//     0, // Vertex 1
//     0,
//     1,
//     0, // Vertex 2
//     1,
//     0,
//     0, // Vertex 3
// ]);

/**
 * The positionsArray is a Float32Array that contains the vertex data for the triangle.
 * To create a geometry, we need to create a BufferAttribute using our positionsArray and set it as the position attribute of the geometry.
 */
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute('position', positionsAttribute);

/**
 * OR we can create a random geometry using the BufferGeometry class
 */
const count = 500; // number of triangles to create
const positionsArray = new Float32Array(count * 3 * 3); // 3 vertices per triangle, 3 coordinates per vertex

for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 2; // random number between -1 and 1
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
