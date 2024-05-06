import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Position - a 3D vector in space of type Vector3
// Position can either be set individually in a single dimension
mesh.position.x = 0.7; // positive value moves to the right, negative to the left
mesh.position.y = -0.6; // positive value moves up, negative moves down
mesh.position.z = 1; // positive value moves towards the camera, negative moves away from the camera

// Or all at once in all 3 dimensions (both have same effect)
mesh.position.set(0.7, -0.6, 1);

// Scale - also an instance of Vector3, just like position
// Scale can also either be set individually in a single dimension
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;

// Or scale in all three dimensions at once (both will have same effect)
mesh.scale.set(2, 0.5, 0.5);

/**
 * Axes Helper:
 * Positioning things in space can be a real challenge. To help us with that, Three.js provides us with an AxesHelper.
 * The AxesHelper will display 3 lines corresponding to the x, y and z axes, each one starting at the center of the scene and going in the corresponding direction.
 * The green line corresponds to the y-axis, red line corresponds to the x-axis, and there is a blue line corresponding to the z-axis on this AxesHelper.
 */
const axes = new THREE.AxesHelper();
scene.add(axes);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// we need to do any transformation before rendering the scene, otherwise it will not be applied
renderer.render(scene, camera);
