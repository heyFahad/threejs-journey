import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animations in Three.js work like Stop Motion where we move the objects a little and then perform a render to show it on the screen.
 * We repeat this process multiple times to create an animation.
 */

// Store the current time to later use it to calculate the deltaTime
let time = Date.now();

/**
 * Create a function named tick and call this function once.
 * In this function, use window.requestAnimationFrame(...) to call this same function on the next frame:
 */
const tick = () => {
    /**
     * Creating an animation using requestAnimationFrame will result in different result in different screens having different refresh rates (60Hz vs 165Hz).
     * To overcome this problem, we use the time difference between the current frame’s time and the time of previous frame,
     * and then doing the transformation based on this deltaTime.
     */
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;

    // Update objects
    mesh.rotation.y += 0.001 * deltaTime;

    // Render the Three.js scene
    renderer.render(scene, camera);

    /**
     * Call tick again on the next frame.
     * The purpose of requestAnimationFrame is to call the passed function ONLY ONCE ON THE NEXT FRAME.
     */
    window.requestAnimationFrame(tick);
};

// Call this function once to start the animation.
tick();
