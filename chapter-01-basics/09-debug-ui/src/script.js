import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Add the Debug UI with the lil-gui library
 */
const gui = new GUI();
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugObject.color = '#a778d8';
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Enable debug controls for the mesh (elevation) position by adding a GUI slider
 */
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Elevation');

/**
 * Add some checkbox controls in the Debug UI
 * GUI automatically detects the type of the property and creates the appropriate control
 */
gui.add(mesh, 'visible').name('Show');
gui.add(material, 'wireframe').name('Wireframe');

/**
 * Adding a color tweak control in the Debug UI is a bit more complex because Three.js applies some color management in order to optimize the rendering
 * If we change the color of the material directly, it won't work as expected
 * We need to put the color outside of Three.js world (in our own debugObject), and add the debug control on this external color
 * Then, we need to listen to the color change and update the material color accordingly
 */
gui.addColor(debugObject, 'color').onChange(() => {
    material.color.set(debugObject.color);
});

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
