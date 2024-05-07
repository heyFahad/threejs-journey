import * as THREE from 'three';

/**
 * Cursor position:
 * Let's maintain a map of the cursor position in the normalized device coordinates (NDC).
 */
const cursor = {
    x: 0,
    y: 0,
};

// Update the cursor position when the mouse moves
window.addEventListener('mousemove', (event) => {
    // Normalized device coordinates (NDC)
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
});

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

/**
 * Camera: OrthographicCamera
 * Differs from the PerspectiveCamera by its lack of perspective.
 * This means that objects will appear the same size regardless of their distance from the camera.
 * This projection mode is often used for technical applications, such as CAD software or architectural visualizations.
 * It can also be used for 2D games or simulations.
 *
 * Parameters:
 * Instead of a field of view, we provide how far the camera can see in each direction (left, right, top, bottom). Then, we provide the near and far clipping planes.
 * 1. Left: The position of the left plane.
 * 2. Right: The position of the right plane.
 * 3. Top: The position of the top plane.
 * 4. Bottom: The position of the bottom plane.
 * 5. Near clipping plane: The closest distance that the camera can see.
 * 6. Far clipping plane: The farthest distance that the camera can see.
 *
 * If we use the same values for left, right, top, and bottom (like -1, 1, 1, and -1 respectively), we get a square camera frustum. And this square frustum will be stretched to the aspect ratio of the canvas, if our canvas is not square.
 * To fix this, we need to use the aspect ratio of the canvas to calculate the correct values for left and right planes of the camera.
 */
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);

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

// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
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
    /**
     * Update camera:
     * Let's update the camera position to follow the cursor on every frame (multiplying the cursor position by 10 to have a better view),
     * and also make it look at the mesh so that we can see the object from all the sides because of camera's perspective.
     */
    // camera.position.x = cursor.x * 10;
    // camera.position.y = cursor.y * 10;

    /**
     * UPDATE:
     * Let's change our code a little bit to make the camera rotate in a complete circle around the object, not just follow the cursor to only view the sides of the object. We can do this by using Math.sin and Math.cos functions.
     * `sin` and `cos`, when combined and used with the same angle, enable us to place things on a circle.
     *
     * REMEMBER:
     * We need to use the SAME ANGLE for both `sin` and `cos` to place the camera on a circle. For this, we can use either cursor.x or cursor.y to find the exact location of camera around the object (in a circle).
     * To revolve the camera horizontally around the object, we can use the x-axis and the z-axis to form an orbit around the object, and use the cursor.x value as the angle.
     */
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;

    // that was revolving the camera horizontally around the object. To view the upper and lower sides of the object, we still need to update the y-axis of the camera position as we move our cursor vertically.
    camera.position.y = cursor.y * 5;

    // finally, make the camera look at the object whenever its position changes
    camera.lookAt(mesh.position);

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
