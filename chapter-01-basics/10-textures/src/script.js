import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Textures
 * We can either load the textures manually by creating an Image object and setting its src property, or use the TextureLoader class.
 */
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//     texture.needsUpdate = true;
// };

// image.src = '/textures/door/color.jpg';

/**
 * We can also create a `LoadingManager` to handle the loading of multiple textures, and keeping track of their loading progress.
 */
const loadingManager = new THREE.LoadingManager(); // we'll pass this loading manager to the TextureLoader constructor when creating a new instance of it.

// before loading a texture, we can add some event listeners to our loading manager to keep track of the loading progress:
loadingManager.onStart = () => {
    console.log('loading started');
};

loadingManager.onLoad = () => {
    console.log('loading finished');
};

loadingManager.onProgress = () => {
    console.log('loading in progress');
};

loadingManager.onError = () => {
    console.log('loading error');
};

// the preferred way to load textures is to use the TextureLoader class:
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/door/color.jpg');

/**
 * Textures used as `map` and `matcap` are supposed to be encoded in sRGB.
 *
 * In the latest versions of Three.js we need to specify it by setting their colorSpace to THREE.SRGBColorSpace:
 */
colorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * An example to show how to load multiple textures and keep track of their loading progress.
 * After these 6 lines added, we'll receive
 * - 1 event for `onStart`
 * - 7 events for `onProgress` (1 for colorTexture and the rest of 6 for the following lines)
 * - and 1 event for `onLoad`.
 */
textureLoader.load('/textures/door/alpha.jpg');
textureLoader.load('/textures/door/height.jpg');
textureLoader.load('/textures/door/normal.jpg');
textureLoader.load('/textures/door/ambientOcclusion.jpg');
textureLoader.load('/textures/door/metalness.jpg');
textureLoader.load('/textures/door/roughness.jpg');

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
