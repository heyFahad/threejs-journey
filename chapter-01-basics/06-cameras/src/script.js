import * as THREE from 'three';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
    width: 800,
    height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 5, 5, 5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(mesh);

// Camera
/**
 * Camera: PerspectiveCamera
 * The most common projection mode used for rendering a 3D scene.
 * This projection mode is designed to mimic the way the human eye sees
 *
 * Parameters:
 * 1. Field of view (fov): The vertical field of view of the camera in degrees.
 * 2. Aspect ratio: The aspect ratio of the camera's view (width / height).
 * 3. Near clipping plane: The closest distance that the camera can see.
 * 4. Far clipping plane: The farthest distance that the camera can see. We can keep this value reasonably low to improve performance by not rendering objects that are too far away from the camera.
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    mesh.rotation.y = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
