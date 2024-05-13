import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

/**
 * Add the Debug UI with the lil-gui library
 */
const gui = new GUI({
    width: 300,
    title: 'Nice Debug UI',
    closeFolders: false, // we can close the Debug UI by default
});

// gui.close(); // we can close the Debug UI by default
// gui.hide(); // we can hide the Debug UI by default

window.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        gui.show(gui._hidden);
    }
});

const debugObject = {};

/**
 * We can also add different folders in the Debug UI to organize the controls better
 */
const cubeTweaks = gui.addFolder('Awesome cube');
// cubeTweaks.close(); // we can close the folder by default

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
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Enable debug controls for the mesh (elevation) position by adding a GUI slider
 */
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Elevation');

/**
 * Add some checkbox controls in the Debug UI
 * GUI automatically detects the type of the property and creates the appropriate control
 */
cubeTweaks.add(mesh, 'visible').name('Show');
cubeTweaks.add(material, 'wireframe').name('Wireframe');

/**
 * Adding a color tweak control in the Debug UI is a bit more complex because Three.js applies some color management in order to optimize the rendering
 * If we change the color of the material directly, it won't work as expected
 * We need to put the color outside of Three.js world (in our own debugObject), and add the debug control on this external color
 * Then, we need to listen to the color change and update the material color accordingly
 */
cubeTweaks.addColor(debugObject, 'color').onChange(() => {
    material.color.set(debugObject.color);
});

/**
 * Adding a function/button in the Debug UI to perform an action
 * Lil-gui will automatically detect that the property is a function and create a button control
 */
debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1 });
};
cubeTweaks.add(debugObject, 'spin').name('Spin');

/**
 * Tweaking the geometry
 * We cannot directly add a GUI control to the geometry because it's not a property of the geometry object
 * We need to create a new object with the properties we want to tweak and then add it to the GUI
 */
// cubeTweaks.add(geometry, 'width').min(0).max(2).step(0.01).name('Width'); // this will throw an error
debugObject.geometry = {
    subdivision: geometry.parameters.widthSegments,
};
cubeTweaks
    .add(debugObject.geometry, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .name('Segments')
    // a better way to update the geometry is to listen to the onFinishChange event
    .onChange(() => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(
            geometry.parameters.width,
            geometry.parameters.height,
            geometry.parameters.depth,
            debugObject.geometry.subdivision,
            debugObject.geometry.subdivision,
            debugObject.geometry.subdivision
        );
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
